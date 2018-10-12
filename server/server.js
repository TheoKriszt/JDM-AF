const express = require('express');
const app = express();
app.use(express.json());

const iconv  = require('iconv-lite');

const cors = require('cors');
app.use(cors());

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

const request = require('request');

const SearchResultHelper = require('./search/search_result_helper');

const FileHelper = require('./file/file_helper');

const EntriesHelper = require('./entries/entries_helper');

const TIME_WEEK = 604800;

const sendRes = function(res, json){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-type","application/json");
  res.end(json);
};

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  console.log("New request");
  next();
});

// Search by word
app.get("/search/word/:word",function(req,res){

  let word = req.params.word;

  console.log('search', word);

  cache.get(word, function(error, searchResult){
    if(!error ){
      if(searchResult === undefined){
        console.log(word, 'not found in cache');

        searchResult = FileHelper.fileToJSONObject(word);

        if(searchResult !== null) {
          console.log(word, 'found in data');

          cache.set(searchResult.formatedWord, searchResult, TIME_WEEK);

          sendRes(res, JSON.stringify(searchResult));
        }
        else
        {
          console.log(word, 'not found in data');

          let encodedWord = iconv.encode(word, 'ISO-8859-1'); // ISO-8859-1 == LATIN1

          let formatedURL = 'http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&output=onlyxml';

          console.log(formatedURL);

          request(formatedURL, function (error, response, body)
          {
            console.log('statusCode :', response && response.statusCode);

            if(error !== null)
              console.log('error :', error);

            if (response.statusCode === 200) {
              let tagCode = body.substring(body.indexOf('<CODE>'), body.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result
              let searchResult = SearchResultHelper.extractSearchResult(tagCode);

              cache.set(searchResult.formatedWord, searchResult, TIME_WEEK);

              FileHelper.JSONObjectTofile(word, searchResult);

              sendRes(res, JSON.stringify(searchResult));
            }
            else
              sendRes(res, "error " + response.statusCode);
          });
        }
      }else{
        console.log(word, 'found in cache');

        sendRes(res, JSON.stringify(searchResult));
      }
    }
  });
});

// Search by word, only in the cache
app.get("/search/cache/word/:word",function(req,res){

  let word = req.params.word;

  console.log('search in cache', word);

  cache.get(word, function(err, searchResult ){
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

  var content = FileHelper.fileToJSONObject(word);

  if(content === null)
    console.log(word, 'not found in data');
  else
  {
    console.log(word, 'found in data');

    sendRes(res, JSON.stringify(content));
  }
});

// Return all current keys in cache, usefull for autocompletion
app.get("/cache/entries",function(req,res){
  console.log('cache entries');

  console.log(cache.keys());

  sendRes(res, JSON.stringify(cache.keys()));
});

// Read csv
app.get("/readcsv", function(req,res){
  let entries = EntriesHelper.readJDMEntries();

  console.log('entries : ', entries);

  sendRes(res, entries);
});

// Quick search only
// Should handle autocompletion from an exhaustive preloaded list
// Should handle a joker caracter such as '*', '?', '%' etc.
// TODO : this is just a dummy/stub that needs to be properly implemented
app.get("/autocomplete/:searchedWord",function(req,res){

  const searchedWord =  req.params.searchedWord;
  // TODO : en attendant, on liste juste les entrées en cache
  const exhaustiveTermsList = cache.keys();

  let matches = [];

  for( let match of exhaustiveTermsList ){
    if (match.startsWith(searchedWord)){
      matches.push(match);
    }
  }

  sendRes(res, JSON.stringify(matches));
});

console.log('JDM-AF Server started');
app.listen(8888);
