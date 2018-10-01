const express = require('express');
const app = express();
app.use(express.json());

const Iconv  = require('iconv').Iconv;

const cors = require('cors');
app.use(cors());

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const request = require('request');

const HTMLParser = require('node-html-parser');

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

  myCache.get(word, function(err, searchResult){
    if( !err ){
      if(searchResult === undefined){
        console.log(word, 'not found in cache');

        var iconv = new Iconv('UTF-8','LATIN1');
        var encodedWord = iconv.convert(word).toString();

        let formatedURL = 'http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&output=onlyxml';

        console.log(formatedURL);

        request(formatedURL, function (error, response, body) {
          console.log('error:', error);
          console.log('statusCode:', response && response.statusCode);

          let tagCode = body.substring(body.indexOf('<CODE>'), body.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result

          let root = HTMLParser.parse(tagCode);

          let searchResult = {
            'word': '',
            'formatedWord': '',
            'definition': '',
            'relationOut' : '',
            'relationIn' : '',
          };

          if(root.querySelector('mot') != null)
            searchResult.word = root.querySelector('mot').toString();

          if(root.querySelector('mot-formate') != null)
            searchResult.formatedWord = root.querySelector('mot').toString();

          if(root.querySelector('def') != null)
            searchResult.definition = root.querySelector('mot').toString();

          if(root.querySelector('sortant') != null)
            searchResult.relationOut = root.querySelector('mot').toString();

          if(root.querySelector('entrant') != null)
            searchResult.relationIn = root.querySelector('mot').toString();

          myCache.set(word, searchResult, 604800); //1 week

          sendRes(res, JSON.stringify(searchResult));
        });
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

  myCache.get(word, function(err, searchResult ){
    if( !err ){
      if(searchResult === undefined){
        sendRes(res, word + ' not found in cache');
      }else{
        sendRes(res, JSON.stringify(searchResult));
      }
    }
  });
});

app.listen(8888);
