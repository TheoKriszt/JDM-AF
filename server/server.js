console.time("serverStart");

const express = require('express');
const app = express();
app.use(express.json());

const GoogleImages = require('google-images');
const imageClient = new GoogleImages('015223342477191193629:yv0pl5-k9zy', 'AIzaSyBq3WnEdRVaUVXv4fKo0i6ncvz-tBjUg-0');

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

const clone = require('clone');

let JDM_Entries = EntriesHelper.readEntries('./data/entries/wikipedia_entries/wikipedia_entries.json');
//let JDM_Entries = EntriesHelper.readEntries('./data/entries/jdm_entries/jdm_entries.json');

let JDM_Relations = FileHelper.fileToJSONObject('./data/jdm_relations/jdm_relations.json');
let JDM_Relations_Entries = EntriesHelper.readRelationsEntry();

const http = require('http');

const RezoSearchResultHelper = require('./helper/search_result_helper');

const sendRes = function(res, json)
{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-type","application/json");
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

  let minimalSearchResult = {
    'formatedWord': '',
    'definitions': [],
  };

  wordCache.get(word, function (error, searchResult)
  {
    if (!error) {
      if (searchResult === undefined) {
        console.log(word, 'not found in cache');

        searchResult = FileHelper.fileToJSONObject('./data/search_result/' + word + '.json');

        if (searchResult !== null) {
          console.log(word, 'found in data');

          wordCache.set(searchResult.formatedWord, searchResult, EXPIRATION_TIME);

          idWordCache.set(searchResult.id, searchResult.formatedWord, EXPIRATION_TIME);

          minimalSearchResult.formatedWord = clone(searchResult.formatedWord);
          minimalSearchResult.definitions = clone(searchResult.definitions);

          JDM_Entries.addWord(word, word);

          sendRes(res, JSON.stringify(minimalSearchResult));
        }
        else {
          console.log(word, 'not found in data');

          //let encodedWord = iconv.encode(word, 'win1252');
          //let encodedWord = encodeURIComponent(encodedWord);

          let encodedWord = word;

          let formatedUrl = 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&rel=';

          console.log(formatedUrl);

          http.get(formatedUrl, function (httpResult) {
            let data = [];
            httpResult.on('data', function (chunk) {
              data.push(chunk);
            });

            httpResult.on('end', function ()
            {
              let decodedBody = iconv.decode(Buffer.concat(data), 'win1252');

              let encodedBody = iconv.encode(decodedBody, 'utf8').toString();

              let tagCodeIndex = encodedBody.indexOf('<CODE>');

              if(tagCodeIndex === -1)
              {
                sendRes(res, "Mot non trouvé");
                return;
              }

              let tagCode = encodedBody.substring(tagCodeIndex, encodedBody.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result

              let tags = tagCode.toString().split('//');

              searchResult = RezoSearchResultHelper.extractSearchResult(tags);

              searchResult.formatedWord = word;

              RezoSearchResultHelper.sortRelations(searchResult, RezoSearchResultHelper.compareRelationsWeight);

              wordCache.set(searchResult.formatedWord, searchResult, EXPIRATION_TIME);

              idWordCache.set(searchResult.id, searchResult.formatedWord, EXPIRATION_TIME);

              FileHelper.JSONObjectTofile('./data/search_result/' + word + '.json', searchResult);

              minimalSearchResult.formatedWord = clone(searchResult.formatedWord);
              minimalSearchResult.definitions = clone(searchResult.definitions);

              JDM_Entries.addWord(word, word);

              sendRes(res, JSON.stringify(minimalSearchResult));
            })

          }).on("error", (error) => {
            console.log("Error : " + error.message);
          });
        }
      } else {
        console.log(word, 'found in wordCache');

        minimalSearchResult.formatedWord = clone(searchResult.formatedWord);
        minimalSearchResult.definitions = clone(searchResult.definitions);

        JDM_Entries.addWord(word, word);

        sendRes(res, JSON.stringify(minimalSearchResult));
      }
    }
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
          console.log(word);

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

  let word = req.params.word;
  let types = req.body.relationTypes;
  let rIn = req.body.wantIn;
  let rOut = req.body.wantOut;
  let sort = req.body.wantSort;
  let relationIn = [{}];
  let relationOut = [{}];

  console.log('/search/relation/' + word);

  if (types && types.indexOf('r_') === -1){
    // console.log('devrait ajouter toutes les rels');
    types = [];
    for (let relType of JDM_Relations.types){
      if (relType.id !== "-1"){
        types.push(relType.name);
        // console.log('\t ajout du type ' + JSON.stringify(relType.name))
      }
    }
    
  }

  // console.log(types);

  wordCache.get(word, function(err, searchResult)
  {
    if(!err )
    {
      if(searchResult === undefined)
        console.log(word, 'not found in wordCache');
      else{
        console.log(word, 'found in wordCache');

        console.log('Sort mode : ' , JSON.stringify(sort));
        if(sort === "true"){
          RezoSearchResultHelper.sortRelations(searchResult, RezoSearchResultHelper.compareRelationsFrenchOrder);
        }
        console.log("searchResult : " + JSON.stringify(searchResult.relationsIn));
        console.log("rIn : " + rIn);
        console.log("rOut : " + rOut);

        // On s'attend à un tableau
        if ( typeof types === 'string'){
          types = [types];
        }

        // flag true si recherche de tous les types
        let searchAll = false;
        for (let t of types){
          if (t.indexOf('r_') < 0 && t.indexOf('ous') >= 0){ // 'r_' absent et 'Tous' présent
            searchAll = true;
            break;
          }
        }

        for(let t in types){
          if(rIn){
            for(let relation in searchResult.relationsIn){
              // console.log('relation : ' + JSON.stringify(searchResult.relationsIn[relation]));
              if(searchResult.relationsIn[relation] !== undefined){
                if(searchAll || types[t]  === searchResult.relationsIn[relation].relationType){

                  // console.log("relation : " + searchResult.relationsIn[relation].relationType);
                  // console.log(searchResult.relationsIn[relation].values.length);

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
                  // console.log(searchResult.relationsOut[relation].values.length);

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

        console.log("Relation entrante (1) : \n" + JSON.stringify(relations.relationIn));
        console.log("Relation entrante (2) : \n" + JSON.stringify(relationIn));

        console.log("Relation sortante (1): \n" + JSON.stringify(relations.relationOut));
        console.log("Relation sortante (2): \n" + JSON.stringify(relationOut));

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

    for (let index = 0; index < listSize; index++)
      if(data[index] !== undefined)
        entries.push(clone(data[index]['data']));

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
  
  // console.log("data : " + data.length);
  // console.log(JSON.stringify(data.types));

  if(data !== undefined && data !== null) {
    sendRes(res, JSON.stringify(data));
  }
  else
    sendRes(res, JSON.stringify([]))
});

app.get("/imagesearch/:word",function(req,res){
  let word = req.params.word;

  console.log('/imagesearch/', word);
  // var url = getFirstImageURL(word);
  // console.log('URL : ', url);

  imageClient.search(word).then(images => {
    // console.log('Image : ' + JSON.stringify(images[0]));

    const randomIndex = Math.floor(Math.random() * Math.floor(10));
    const imgUrl = images[randomIndex].url;
    // const imgTxt = '<img src=""'+ imgUrl +'">';

      // sendRes(res, JSON.stringify({'url' : imgUrl}));
      // res.sendFile(imgUrl)
    res.redirect(imgUrl);
  }).catch(error => {
    console.log(error);
  });






  // if(content === null)
  //   console.log(word, 'not found in data');
  // else
  // {
  //   console.log(word, 'found in data');
  //
  //   sendRes(res, JSON.stringify(content));
  // }
});

console.timeEnd("serverStart");

app.listen(8888);
