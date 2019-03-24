console.time("serverStart");

const express = require('express');
const app = express();
app.use(express.json());

const GoogleImages = require('google-images');
const imageClient = new GoogleImages('015223342477191193629:yv0pl5-k9zy', 'AIzaSyBq3WnEdRVaUVXv4fKo0i6ncvz-tBjUg-0');
// const imageClient = new GoogleImages('015223342477191193629:yv0pl5-k9zy', 'AIzaSyBq3WnEdRVaUVXv4fKo0i6ncvz-tBjUg-0');

const iconv  = require('iconv-lite');

const cors = require('cors');
app.use(cors());

const NodeCache = require( "node-cache" );
const wordCache = new NodeCache(); //word -> json
const idWordCache = new NodeCache(); //idWord -> json

const SearchResultHelper = require('./search/search_result_helper');

const FileHelper = require('./file/file_helper');

const EntriesHelper = require('./entries/entries_helper');

const EXPIRATION_TIME = 604800;
const HTTP_REQUEST_TIMEOUT = 8000; // Milisecond
const LIMITE_DISK_SPACE = 200; // Mo

const clone = require('clone');

let JDM_Entries = EntriesHelper.readEntries('./data/entries/wikipedia_entries/wikipedia_entries.json');
//let JDM_Entries = EntriesHelper.readEntries('./data/entries/jdm_entries/jdm_entries.json');

let JDM_Relations = FileHelper.fileToJSONObject('./data/jdm_relations/jdm_relations.json');
let JDM_Relations_Entries = EntriesHelper.readRelationsEntry();

const http = require('http');

const RezoSearchResultHelper = require('./helper/search_result_helper');

const sendRes = function(res, json)
{
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type","application/json");
  } catch (e) {
    console.error(e);
    // arrive avec un timeout de JDM/rezo-dump
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  }

  res.end(json);
};

app.all("/*", function(req, res, next)
{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  console.log("New request");
  next();
});

app.get("/search/word/:word",function(req,res)
{
  let word = req.params.word;

  console.log('/search/word/' + word);

  let searchResult = wordCache.get(word);

  let minimalSearchResult = {
    'formatedWord': '',
    'definitions': [],
  };

  if(searchResult !== undefined)
  {
    console.log(word, 'found in wordCache');

    minimalSearchResult.formatedWord = clone(searchResult.formatedWord);
    minimalSearchResult.definitions = clone(searchResult.definitions);

    JDM_Entries.addWord(word, word);

    sendRes(res, JSON.stringify(minimalSearchResult));

    return;
  }

  console.log(word, 'not found in wordCache');

  searchResult = FileHelper.fileToJSONObject('./data/search_result/' + word + '.json');

  if (searchResult !== null && searchResult.id != null)
  {

    wordCache.set(searchResult.formatedWord, searchResult, EXPIRATION_TIME);

    idWordCache.set(searchResult.id, searchResult.formatedWord, EXPIRATION_TIME);

    minimalSearchResult.formatedWord = clone(searchResult.formatedWord);
    minimalSearchResult.definitions = clone(searchResult.definitions);

    JDM_Entries.addWord(word, word);

    sendRes(res, JSON.stringify(minimalSearchResult));

    return;
  }

  console.log(word, 'not found in data');

  let encodedWord = word;

  let formatedUrl = 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&rel=';

  console.log(formatedUrl);

  let httpRequest = http.get(formatedUrl, function (httpResult) {
    let data = [];
    httpResult.on('data', function (chunk)
    {
      data.push(chunk);
    });

    httpResult.setTimeout(HTTP_REQUEST_TIMEOUT, function()
    {
      console.error('JDM API timeout');
      // res.status(503); // service unavailable

      let response = {};
      response.message = 'JDM API timeout';
      response.statusCode = 503;
      sendRes(res, JSON.stringify(response));

      return;
    });

    httpResult.on('end', function ()
    {
      let decodedBody = iconv.decode(Buffer.concat(data), 'win1252');

      let encodedBody = iconv.encode(decodedBody, 'utf8').toString();

      let tagCodeIndex = encodedBody.indexOf('<CODE>');

      if (tagCodeIndex === -1) {
        let response = {};
        response.message = 'Word not found';
        response.statusCode = 404;
        sendRes(res, JSON.stringify(response));
        return;
      }

      let tagCode = encodedBody.substring(tagCodeIndex, encodedBody.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result

      let tags = tagCode.toString().split('// ');

      searchResult = RezoSearchResultHelper.extractSearchResult(tags);

      searchResult.formatedWord = word;

      RezoSearchResultHelper.sortRelations(searchResult, RezoSearchResultHelper.compareRelationsWeight);

      wordCache.set(searchResult.formatedWord, searchResult, EXPIRATION_TIME);

      idWordCache.set(searchResult.id, searchResult.formatedWord, EXPIRATION_TIME);

      if(FileHelper.checkAvailableSpace(LIMITE_DISK_SPACE))
        FileHelper.JSONObjectTofile('./data/search_result/' + word + '.json', searchResult);
      else {
        console.error('Limited disk space depassed');
      }

      minimalSearchResult.formatedWord = clone(searchResult.formatedWord);
      minimalSearchResult.definitions = clone(searchResult.definitions);

      JDM_Entries.addWord(word, word);

      sendRes(res, JSON.stringify(minimalSearchResult));
    })
  });

  httpRequest.on('error', (error) =>
  {
    console.error('Error : ' + error.message, error.code);

    console.error('ERROR : ' + error);

    if(error.code !== 'ECONNRESET')
      sendRes(res, 'Error : ' + error.message);
  });

  httpRequest.setTimeout( HTTP_REQUEST_TIMEOUT, function() {
    console.error('JDM API timeout');

    httpRequest.abort();
    res.status(503); // service unavailable
    sendRes(res, 'JDM API timeout');
  });

});

// Search an word, with his id
app.get("/search/word/id/:wordId",function(req,res)
{
  console.log('/search/word/id/', wordId);

  let wordId = req.params.wordId;

  idWordCache.get(wordId, function(error, word)
  {
    if (!error)
      if (word !== undefined)
        wordCache.get(word, function(error, wordValue)
        {
          // console.log(word);

          if (!error)
            if (wordValue !== undefined)
              sendRes(res, JSON.stringify(wordValue));
            else
              sendRes(res, word + ' not found in wordCache');
          else
            sendRes(res, JSON.stringify(error));
        });
      else
        sendRes(res, wordId + ' not found in wordIdCache');
    else
      sendRes(res, JSON.stringify(error));
  });
});

// return all relations
app.get("/relations/",function(req,res)
{
  console.log('/relations/');

  sendRes(res, JSON.stringify(JDM_Relations));
});

// return relations for a word and for some type relations
app.post("/search/relation/:word", function(req, res) {

  // console.log('Request params body : ', req.body);
  // console.log(typeof req.body.wantIn, typeof req.body.wantOut, typeof req.body.wantSort);

  let word = req.params.word;
  let types = req.body.relationTypes;
  let rIn = req.body.wantIn;
  let rOut = req.body.wantOut;
  let sort = req.body.wantSort;
  let relationIn = [{}];
  let relationOut = [{}];

  console.log('/search/relation/' + word);

  // On s'attend à un tableau
  if ( typeof types === 'string'){
    types = [];
    types.push(types);
  }

  if (types && types.indexOf('Tous types de relation') >= 0){ // Todo : remplacer la chaîne en dur par une recherche dans JDM_relations
    types = [];
    for (let relType of JDM_Relations.types){
      if (relType.id !== "-1"){
        types.push(relType.name);
      }
    }

  }

  // console.log(types);

  wordCache.get(word, function(err, searchResult)
  {
    if(!err )
    {
      if(searchResult === undefined){
        console.log(word, 'not found in wordCache  :waiting a little');
        let response = {
          message: 'relations are not ready yet',
          statusCode: 423 // Locked - la ressource est indispo
        };

        new Promise(resolve => {
          setTimeout(resolve, 1000);
          return;
          // sendRes(res, JSON.stringify(response));
        }).then(() => {
          sendRes(res, JSON.stringify(response));
          }
        ).catch(reason => console.error(reason));
        


      } else{
        console.log(word, 'found in wordCache');

        // console.log('Sort mode : ' , JSON.stringify(sort));
        // console.log("rIn : " + JSON.stringify(rIn));
        // console.log("rOut : " + JSON.stringify(rOut));
        if(sort){
          RezoSearchResultHelper.sortRelations(searchResult, RezoSearchResultHelper.compareRelationsFrenchOrder);
        }
        // console.log("searchResult : " + JSON.stringify(searchResult.relationsIn));




        // flag true si recherche de tous les types
        let searchAll = false;
        // console.log('types: ', JSON.stringify(types));
        if (types){
          for (let t of types){
            if (t.indexOf('r_') < 0 && t.indexOf('ous') >= 0){ // 'r_' absent et 'Tous' présent
              searchAll = true;
              break;
            }
          }
        }


        for(let t in types){
          if(rIn){
            for(let relation in searchResult.relationsIn){
              // console.log('relation : ' + JSON.stringify(searchResult.relationsIn[relation]));
              if(searchResult.relationsIn[relation] !== undefined){
                if(searchAll || types[t]  === searchResult.relationsIn[relation].relationType){

                  // console.log("relation : " + searchResult.relationsIn[relation].relationType);
                  // console.log(searchResult.relationsIn[relation].values.pageLength);

                  // console.log('pushing ', searchResult.relationsIn[relation]);
                  relationIn.push(searchResult.relationsIn[relation]);
                }
              }
            }
          }

          if(rOut){
            for(let relation in searchResult.relationsOut){
              if(searchResult.relationsOut[relation] !== undefined){
                if(searchAll || types[t] === searchResult.relationsOut[relation].relationType){

                  // console.log("relation : " + searchResult.relationsOut[relation].relationType);
                  // console.log(searchResult.relationsOut[relation].values.pageLength);

                  relationOut.push(searchResult.relationsOut[relation]);
                }
              }
            }
          }
        }


        relationIn.splice(0,1);
        relationOut.splice(0,1);

        relations = {
          relationIn : relationIn,
          relationOut : relationOut,
        };

        console.log("Relations entrantes (1) : \n" + JSON.stringify(relations.relationIn));
        console.log("Relations entrantes (2) : \n" + JSON.stringify(relationIn.length));

        console.log("Relations sortantes (1): \n" + JSON.stringify(relations.relationOut.length));
        console.log("Relations sortantes (2): \n" + JSON.stringify(relationOut.length));

        sendRes(res, JSON.stringify(relations));
      }
    }
  });
});

// Search by word, only in the wordCache
app.get("/search/cache/word/:word",function(req,res)
{
  let word = req.params.word;

  console.log('/search/cache/word/', word);

  wordCache.get(word, function(err, searchResult ){
    if( !err ){
      if(searchResult === null){
        sendRes(res, word + ' not found in cache');
      }else{
        sendRes(res, JSON.stringify(searchResult));
      }
    }
  });
});

// Search by word, only in the data files
app.get("/search/file/word/:word",function(req,res){
  let word = req.params.word;

  console.log('/search/file/word/', word);

  var content = FileHelper.fileToJSONObject('./data/search_result/' + word + '.json');

  if(content === null)
    console.log(word, 'not found in data');
  else
  {
    console.log(word, 'found in data');

    sendRes(res, JSON.stringify(content));
  }
});

// Return all current keys in wordCache, usefull for autocompletion
app.get("/cache/entries",function(req,res)
{
  console.log('wordCache entries');

  console.log(wordCache.keys());

  sendRes(res, JSON.stringify(wordCache.keys()));
});

// Quick search only
// Should handle autocompletion from an exhaustive preloaded list
// Should handle a joker caracter such as '*', '?', '%' etc.
app.get("/autocomplete/:searchedWord",function(req,res){

  const searchedWord =  req.params.searchedWord;

  console.log('/autocomplete/', searchedWord);

  let data = JDM_Entries.findData(searchedWord);

  if(data !== undefined && data !== null) {

    let entries = [];

    let listSize = 0;

    if (data.length > 10)
      listSize = 10;
    else
      listSize = data.length;

    for (let index = 0; index < listSize; index++){
      if(data[index] !== undefined) {
        const pushed = clone(data[index]['data']);
        if(entries.indexOf(pushed) === -1){
          // console.log('pushing ' + pushed);
          entries.push(pushed);
        }

      }
    }


    SearchResultHelper.sortAutocomplete(entries, SearchResultHelper.compareAutocompleteFrenchOrder);
    console.log('apres tri : ', entries);

    sendRes(res, JSON.stringify(entries));
  }
  else
    sendRes(res, JSON.stringify([]))
});

// Quick search only
// Should handle autocompletion from an exhaustive preloaded list
// Should handle a joker caracter such as '*', '?', '%' etc.
app.get("/autocomplete/relations/:searchedRelation",function(req,res)
{
  const searchedRelation =  req.params.searchedRelation;

  console.log('/autocomplete/relations/', searchedRelation);

  let data = JDM_Relations_Entries.findData(searchedRelation);
  console.log("data : " + data);
  if(data !== undefined && data !== null) {

    let entries = [];

    let listSize = 0;

    if (data.length > 10)
      listSize = 10;
    else
      listSize = data.length;

    for (let index = 0; index < listSize; index++)
      if(data[index] !== undefined)
        entries.push(clone(data[index]['data']));

    sendRes(res, JSON.stringify(entries));
  }
  else
    sendRes(res, JSON.stringify([]))
});

//Return All types of relations.
app.get("/relations/relationTypes", function(req, res){

  console.log('GET /relations/relationTypes');
  // let data = ['toutes'];
  // for (relType of JDM_Relations){
  //   data.push(relType);
  //   console.log('adding ' + JSON.stringify(relType));
  // }
  let data  = JDM_Relations;

  // console.log("data : " + data.pageLength);
  // console.log(JSON.stringify(data.types));

  if(data !== undefined && data !== null) {
    sendRes(res, JSON.stringify(data));
  }
  else
    sendRes(res, JSON.stringify([]))
});

app.get("/imagesearch/:word",function(req,res){
  let word = req.params.word;

  console.log('/imagesearch/' + word);
  // var url = getFirstImageURL(word);
  // console.log('URL : ', url);

  imageClient.search(word).then(images => {
    // console.log('Image : ' + JSON.stringify(images[0]));

    const randomIndex = Math.floor(Math.random() * Math.floor(10));
    const image = images[randomIndex];
    const imgUrl = image.url;
    console.log('img URL : ' + imgUrl);
    res.redirect(imgUrl);
  }).catch(error => {
    console.log(error);
    res.redirect('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Pas_d%27image_disponible.svg/300px-Pas_d%27image_disponible.svg.png');

  });






  // if(content === null)
  //   console.log(word, 'not found in data');
  // elseOnView
  // {
  //   console.log(word, 'found in data');
  //
  //   sendRes(res, JSON.stringify(content));
  // }
});

console.timeEnd("serverStart");

app.listen(8889);
