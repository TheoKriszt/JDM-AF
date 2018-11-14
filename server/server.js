console.time("serverStart");

const express = require('express');
const app = express();
app.use(express.json());

const iconv  = require('iconv-lite');

const cors = require('cors');
app.use(cors());

const NodeCache = require( "node-cache" );
const wordCache = new NodeCache(); //word -> json
const idWordCache = new NodeCache(); //idWord -> json

const SearchResultHelper = require('./search/search_result_helper');

const FileHelper = require('./file/file_helper');

const EntriesHelper = require('./entries/entries_helper');

const TIME_WEEK = 604800;

const clone = require('clone');

let JDM_Entries = EntriesHelper.readWikipediaEntries(); //EntriesHelper.readJDMEntries();
let JDM_Relations = FileHelper.fileToJSONObject('./data/jdm_relations/jdm_relations.json.back');
let JDM_Relations_Entries = EntriesHelper.readRelationsEntry();

const http = require('http');

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

// Search by word
app.get("/search/word/:word",function(req,res)
{
  let word = req.params.word;

  console.log('/search/word/', word);

  wordCache.get(word, function(error, searchResult){
    if(!error ){
      if(searchResult === undefined){
        console.log(word, 'not found in cache');

        searchResult = FileHelper.fileToJSONObject('./data/search_result/' + word + '.json');

        if(searchResult !== null) {
          console.log(word, 'found in data');

          wordCache.set(searchResult.formatedWord, searchResult, TIME_WEEK);

          idWordCache.set(searchResult.word.id, searchResult.formatedWord, TIME_WEEK);

          sendRes(res, JSON.stringify(searchResult));
        }
        else
        {
          console.log(word, 'not found in data');

          let encodedWord = iconv.encode(word, 'win1252');

          let formatedURL = 'http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&output=onlyxml';

          http.get(formatedURL, function(httpResult)
          {
            var data = [];
            httpResult.on('data', function(chunk)
            {
              data.push(chunk);
            });

            httpResult.on('end', function()
            {
              var decodedBody = iconv.decode(Buffer.concat(data), 'win1252');

              var encodedBody = iconv.encode(decodedBody, 'utf8').toString();

              let tagCode = encodedBody.substring(encodedBody.indexOf('<CODE>'), encodedBody.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result

              let searchResult = SearchResultHelper.extractSearchResult(tagCode);

              wordCache.set(searchResult.formatedWord, searchResult, TIME_WEEK);

              idWordCache.set(searchResult.word.id, searchResult.formatedWord, TIME_WEEK);

              FileHelper.JSONObjectTofile('./data/search_result/' + word + '.json', searchResult);

              sendRes(res, JSON.stringify(searchResult));
            })

          }).on("error", (error) => {
            console.log("Error : " + error.message);
          });
        }
      }else{
        console.log(word, 'found in wordCache');

        sendRes(res, JSON.stringify(searchResult));
      }
    }
  });
});

// Search an word, with his id
app.get("/search/word/id/:wordId",function(req,res)
{
  let wordId = req.params.wordId;

  console.log('/search/word/id/', wordId);

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
  let relationIn = [{}];
  let relationOut = [{}];

  console.log(types);

  wordCache.get(word, function(err, searchResult)
  {
    if(!err )
    {
      if(searchResult === undefined)
        console.log(word, 'not found in wordCache');
      else{
        console.log(word, 'found in wordCache');

        console.log("searchResult : " + searchResult.relationsIn.length);
        for(let t in types){
          if(rIn){
            for(let relation in searchResult.relationsIn){
              if(searchResult.relationsIn[relation] !== undefined){
                if(types[t]  === searchResult.relationsIn[relation].relationType){

                  console.log("relation : " + searchResult.relationsIn[relation].relationType);
                  console.log(searchResult.relationsIn[relation].values.length);

                  relationIn.push(searchResult.relationsIn[relation]);
                }
              }
            }
          }

          if(rOut){
            for(let relation in searchResult.relationsOut){
              if(searchResult.relationsOut[relation] !== undefined){
                if(types[t] === searchResult.relationsOut[relation].relationType){

                  console.log("relation : " + searchResult.relationsOut[relation].relationType);
                  console.log(searchResult.relationsOut[relation].values.length);

                  relationOut.push(searchResult.relationsOut[relation]);
                }
              }
            }
          }
        }

        relations = {
          relationIn : relationIn,
          relationOut : relationOut,
        };

        console.log("Relation entrante (1) : \n" + relations.relationIn);
        console.log("Relation entrante (2) : \n" + relationIn);

        console.log("Relation sortante (1): \n" + relations.relationOut);
        console.log("Relation sortante (2): \n" + relationOut);

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

  let data  = JDM_Relations;
  // console.log("data : " + data.length);
  //console.log(data);

  if(data !== undefined && data !== null) {
    sendRes(res, JSON.stringify(data));
  }
  else
    sendRes(res, JSON.stringify([]))
});

console.timeEnd("serverStart");

app.listen(8888);
