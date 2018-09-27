const express = require('express');
const app = express();
app.use(express.json());

const Iconv  = require('iconv').Iconv;

const cors = require('cors');
app.use(cors());

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

  var iconv = new Iconv('UTF-8','LATIN1');
  var encodedWord = iconv.convert(word).toString();

  let url = 'http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=' + encodedWord + '&output=onlyxml';

  console.log(url);

  request(url, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);

    let root = HTMLParser.parse(body);


    sendRes(res, JSON.stringify(root));
  });
});

app.listen(8888);
