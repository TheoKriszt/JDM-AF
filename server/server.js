const express = require('express');
const app=express();
// const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
app.use(cors());
app.use(express.json());
// const asyncHandler = require('express-async-handler');
const async = require('async');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json);
// app.use(express.urlencoded({extended : true}))

//creation client

const sendRes = function(res, json){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-type","application/json");
  res.end(json);
};

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  console.log("Requete recue");
  next();
});

// Search by word
app.get("/search/word/:word",function(req,res){

  let word = req.params.word;
  console.log('word : ' + word);

  sendRes(res, JSON.stringify(word));
});

// Search by relation
app.get("/search/relation/:relation",function(req,res){

  var oid = new ObjectID(req.params.id);
  console.log('id : ' + req.params.id);
  database.collection("membres").find( {"_id": oid} )
    .toArray(function(err,documents){
      console.log("Recherche de membre par id : " + req.params.id);
      delete documents[0].password;
      console.log(documents);
      var json = JSON.stringify(documents);
      sendRes(res, json);
    });
});

// membre par id
app.get("/membres/id/:id",function(req,res){

  var oid = new ObjectID(req.params.id);
  console.log('id : ' + req.params.id);
  database.collection("membres").find( {"_id": oid} )
  // database.collection("membres").find( {"_id.$oid": req.params.id} )
    .toArray(function(err,documents){
      console.log("Recherche de membre par id : " + req.params.id);
      delete documents[0].password; // ne pas renvoyer le mdp
      console.log(documents);
      var json = JSON.stringify(documents);
      sendRes(res, json);
    });
});








app.listen(8888);
