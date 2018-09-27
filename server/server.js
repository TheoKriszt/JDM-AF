const express = require('express');
const app=express();
// const bodyParser = require('body-parser');
const cors = require("cors");
const ObjectID = require('mongodb').ObjectID;
app.use(cors());
app.use(express.json());
// const asyncHandler = require('express-async-handler');
const async = require('async');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json);
// app.use(express.urlencoded({extended : true}))

//creation client

const mongoClient=require("mongodb").MongoClient;
//creation var db
const url="mongodb://localhost:27017/Covoit";

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



//connection db
mongoClient.connect(url,function(err,db){
  // const database = db; // ancienne version de express
  const database = db.db('Covoit'); // accès nommé à la BD, car express ne reconnait plus simplement db.collection sur les nouvelles versions

  if (err){
    throw err;
  } else{
    console.log("connected to " + url);
  }

//requête repartition age
  app.get("/membres/agerepartition",function(req,res){
    console.log("Recupération des membres");
    database.collection("membres").find()
      .toArray(function(err,documents){
        var somme1825 = 0;
        var somme2635 = 0;
        var somme3650 = 0;
        var somme50   = 0;

        for (doc of documents){
          if(parseInt(doc.age) < 26) somme1825 += 1;
          else if ((parseInt(doc.age) > 25) && (parseInt(doc.age) < 36)) somme2635 += 1;
          else if ((parseInt(doc.age) > 35) && (parseInt(doc.age) < 51)) somme3650 += 1;
          else somme50 += 1;
        }
        var retour = {
          'age1825' : somme1825,
          'age2635' : somme2635,
          'age3650' : somme3650,
          'age50'   : somme50
        };
        var json=JSON.stringify(retour);

        sendRes(res, json);

      });
  });

  // Search by word
  app.get("/search/word/:word",function(req,res){

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

  // Search by word
  app.get("/search/relation/:relation",function(req,res){

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

  // Search by word
  app.get("/search/word/:word",function(req,res){

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
});








app.listen(8888);
