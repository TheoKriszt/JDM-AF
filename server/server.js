const express = require('express');
const app = express();
app.use(express.json());

// const Iconv  = require('iconv').Iconv; // removed : incompilable sous Windows
const iconv  = require('iconv-lite');

const cors = require('cors');
app.use(cors());

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

const request = require('request');

const SearchResultHelper = require('./search/search_result_helper');

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

  cache.get(word, function(err, searchResult){
    if(!err ){
      if(searchResult === undefined){
        console.log(word, 'not found in cache');

        // let iconv = new Iconv('UTF-8','LATIN1');
        // let encodedWord = iconv.convert(word).toString();
        let encodedWord = iconv.encode(word, 'ISO-8859-1'); // ISO-8859-1 == LATIN1

        let formatedURL = 'http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&output=onlyxml';

        console.log(formatedURL);

        request(formatedURL, function (error, response, body) {
          console.log('error:', error);
          console.log('statusCode:', response && response.statusCode);

          if (response.statusCode === 200) {
            let tagCode = body.substring(body.indexOf('<CODE>'), body.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result

            let searchResult = SearchResultHelper.extractSearchResult(tagCode);

            cache.set(searchResult.formatedWord, searchResult, 604800);

            sendRes(res, JSON.stringify(searchResult));
          }
          else
            sendRes(res, "error " + response.statusCode);
        });
      }else{
        console.log(word, 'founded in cache');

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
      if(searchResult === undefined){
        sendRes(res, word + ' not found in cache');
      }else{
        sendRes(res, JSON.stringify(searchResult));
      }
    }
  });
});

// Return all current entries in cache, usefull for autocompletion
app.get("/cache/entries",function(req,res){
  console.log('cache entries');

  console.log(cache.entries);

  console.log(cache.getEntries());

  sendRes(res, JSON.stringify(cache.entries));
});

console.log('JDM-AF Server started');
app.listen(8888);
