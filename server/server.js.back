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

  /**
   * Membres
   */

//requête tous les membres
  app.get("/membres",function(req,res){
    console.log("Recupération des membres");
    database.collection("membres").find()
    // db.collection("membres").find()
      .toArray(function(err,documents){
        //récuperation du résultat
        var json=JSON.stringify(documents);
        //renvoi du resultat
        sendRes(res, json);

      });
  });

//requête nombre de membres
  app.get("/membres/count",function(req,res){
    console.log("Comptage des membres");
    database.collection("membres").find()
      .toArray(function(err,documents){
        var retour = { 'count' : documents.length };
        var json=JSON.stringify(retour);
        sendRes(res, json);

      });
  });

  //retourne moyenne d'age des membres
  app.get("/membres/moyenneage",function(req,res){
    database.collection("membres").find()
      .toArray(function(err,documents){
        var somme = 0;
        for (doc of documents){ somme += parseInt(doc.age); }
        var moyenne = somme / documents.length;

        moyenne = moyenne.toFixed(0);
        var retour = { 'avg' : moyenne};

        var json=JSON.stringify(retour);
        sendRes(res, json)
      });
  });

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

  // membre par role
  app.get("/membres/role/:role",function(req,res){

    console.log('role : ' + req.params.id);
    database.collection("membres").find({"role": req.params.role})
      .toArray(function(err,documents){
        console.log("Recherche de membre par role :");
        var json = JSON.stringify(documents);
        sendRes(res, json);
      });
  });


// // membre par mail
//   app.get("/membres/mail/:mail",function(req,res){
//     console.log("Recupération du membre avec le mail " + req.params.mail);
//     database.collection("membres").find({"mail":req.params.mail})
//       .toArray(function(err,documents){
//         //récuperation du résultat
//         var json=JSON.stringify(documents);
//         //renvoi du resultat
//         sendRes(res, json);
//
//       });
//   });


//requête authentification
  app.get('/membres/authenticate/:mail/:password',function(req,res){
    console.log('authentification par mail/mdp : ' + req.params.mail + " / " + req.params.password);
    var membre = database.collection('membres').find({'mail':req.params.mail, 'password':req.params.password});
    membre.toArray(function(err,documents){
      // console.log(documents);

      if(documents && documents[0] && documents[0].password){
        delete documents[0].password; // ne pas renvoyer le mdp
      }

      console.log(documents);
      //récuperation du résultat
      var json=JSON.stringify(documents);
      sendRes(res, json)
    });


  });


// //Retire un membre
//   app.delete("/membres/:mail/",function(req,res){
//     database.collection("membres").remove({'mail':req.params.mail});
//   });


  // ajoute un nouveau membre
  app.post('/membres', function (req, res) {

    if (!req.body) {
      console.log('bad request : ' + req.body);
      return res.sendStatus(400);
    }

    var user = {
      "nom": req.body.nom,
      "prenom": req.body.prenom,
      "mail": req.body.mail,
      "telephone" : req.body.telephone,
      "age" : parseInt(req.body.age),
      "adresse" : req.body.adresse,
      "password": req.body.password,
      "role": ["membre"],
      "evaluations" : [],
      "vehicule_ids" : []
    };


    console.log("Ajout d'un membre");
    console.log(user);

    database.collection("membres").insertOne(user, function (err, documents) {
      if (err) {
        console.log('ERROR : \n' + err);
      }

      sendRes(res, JSON.stringify(documents));
    });
  });

  // met à jour un membre
  app.post('/membres/update', function (req, res) {

    if(!req.body){
      console.log('bad request : ' + req.body);
      return res.sendStatus(400);
    }

    console.log("modif d'un membre");

    var oid = new ObjectID(req.body._id);

    req.body._id = oid;

    database.collection("membres").update(
      {"_id": oid},
      {$set : req.body},
      function (err, documents) {
        if(err) {
          console.log("Erreur : ");
          console.log(err);
        }else {
          console.log("MAJ OK : ");
          var response = {'updateStatus' : 'OK'};
          sendRes(res, JSON.stringify(response));

        }

      });
  });

  // note laissée par le membre :from au membre :to pour le trajet :tripID
  app.get("/membres/rating/:from/:to/:tripID",function(req,res){

    var oid = new ObjectID(req.params.to);
    var from = req.params.from;
    var tripID = req.params.tripID;

    console.log("Recherche de la note laissée par " + from + " à " + req.params.to + " pour le trajet " + tripID);

    database.collection("membres").find({"_id": oid})
      .toArray(function(err,documents){
        if (documents[0]) {
          documents = documents[0];
        }else {
          throw err;
        }
        let rating = '';
        if(documents.evaluations){
          for (let p of documents.evaluations) {
            if (p.from === from && p.tripID == tripID){
              console.log('MATCH');
              rating = p.rating;
              break;
            }
          }
        }


        var json = JSON.stringify({'rating' : rating});
        console.log('rating : ', rating);
        sendRes(res, json);
      });
  });

  app.post('/membres/rating', function (req, res) {

    if(!req.body){
      console.log('bad request : ' + req.body);
      return res.sendStatus(400);
    }

    var oid = new ObjectID(req.body.to);
    var from = req.body.from;
    var tripID = req.body.tripID;
    var rating = req.body.rating;

    var evaluation = {
      'from' : from,
      'tripID' : tripID,
      'rating' : rating
    };

    database.collection('membres').update(
      { _id: oid },
      { $push: { 'evaluations': evaluation } }
    );

    sendRes(res, JSON.stringify({'status' : 'OK'}))
  });

  /**
   * Trajets
   */

  //retourne tous les trajets
  app.get("/trajets",function(req,res){
    database.collection("trajets").find()
      .toArray(function(err,documents){
        //récuperation du résultat
        var json=JSON.stringify(documents);
        sendRes(res, json)
      });
  });

  //retourne moyenne des prix
  app.get("/trajets/moyenneprix",function(req,res){
    database.collection("trajets").find()
      .toArray(function(err,documents){
        var somme = 0;
        for (doc of documents){ somme += parseInt(doc.prix); }
        var moyenne = somme / documents.length;

        moyenne = moyenne.toFixed(2);
        var retour = { 'avg' : moyenne};

        var json=JSON.stringify(retour);
        sendRes(res, json)
      });
  });

//requête nombre de trajets
  app.get("/trajets/count",function(req,res){
    console.log("Comptage des trajets");
    database.collection("trajets").find()
      .toArray(function(err,documents){
        var retour = { 'count' : documents.length };
        var json=JSON.stringify(retour);
        sendRes(res, json);

      });
  });

  //retourne les :limit derniers trajets
  app.get("/trajets/limit/:limit",function(req,res){
    database.collection("trajets").find().limit(parseInt(req.params.limit))
      .toArray(function(err,documents){
        //récuperation du résultat
        var json=JSON.stringify(documents);
        sendRes(res, json)
      });
  });

  /**
   * Complete le tableau de trajets pour ajouter les infos sur les conducteurs
   * Se fait côté Node pour limiter les échanges client/API
   */
  const completeDriverData = function (trajets, callback) {

    let drivers = []; // tableau d'OID des membres conducteurs

    for (let trajet of trajets) { // recenser les conducteurs
      let oid = new ObjectID(trajet.conducteur);
      drivers.push(oid);
    }

    // insérer les infos du conducteur dans le trajet correspondant
    database.collection("membres").find({"_id": {$in: drivers}})
      .toArray(function (err, data) {
        for (let driver of data )  {

          driver.nbEvaluations = driver.evaluations.length;

          if(driver.evaluations.length === 0) {
            driver.evaluationMoyenne = '?';
          }
          else {
            let avg = 0;
            for (let eval of driver.evaluations){
              avg += parseInt(eval.rating);
            }
            driver.evaluationMoyenne =(avg / driver.evaluations.length).toFixed(1);
          }

          for (let trajet of trajets){

            if(trajet.conducteur == driver._id) {
              delete driver.password;
              delete driver.role;
              trajet.driverData = driver;

              trajet.placesRestantes = trajet.nbPlaces - trajet.passager.length;
              trajet.complet = trajet.placesRestantes == 0 ? 'true' : 'false';


            }
          }
        }
        // console.log("fin de callback 1 : ");
        console.log(trajets);
        callback(null, trajets); // envoyer la réponse JSON
      });

  };

  const completeVehicleData = function (trajets, callback) {

    let vehicles = []; // tableau d'OID des vehicules du trajet

    for (let trajet of trajets) { // recenser les vehicules
      console.log(trajet.vehicule, '', '');
      let oid = new ObjectID(trajet.vehicule._id);
      vehicles.push(oid);
    }

    database.collection("vehicules").find({"_id": {$in: vehicles}})
      .toArray(function (err, data) {
        for (let vehicle of data) {
          for (let trajet of trajets){
            if (trajet.vehicule == vehicle._id) {
              trajet.vehicule = {
                '_id' : trajet.vehicule,
                'label':  trajet.vehicule.modele + ' ' + trajet.vehicule.marque + ', couleur ' + trajet.vehicule.couleur
              };
            }

          }
        }


        callback(null, trajets); // envoyer la réponse JSON
      });
  };

  // trouve les trajets de villed à villea
  app.get("/trajets/search/:villed/:villea",function(req,res){
    console.log("Recherche des trajets de " + req.params.villed + " à " + req.params.villea);
    console.log("prix max : "  + req.query.prixMax);
    console.log("orderBy : "  + req.query.orderBy);

    async.waterfall([
      function (callback) {
        //primo : extraire les trajets de villed à villea
        database.collection("trajets").find(
          {
            'prix': {$lte: parseInt(req.query.prixMax)},
            'depart.ville':  {$regex : new RegExp("^" + req.params.villed.toLowerCase(), "i")},
            'arrivee.ville': {$regex : new RegExp("^" + req.params.villea.toLowerCase(), "i")},
          },
          {"sort": [ [req.query.orderBy,'asc'], ['heure','asc']]}
        ).toArray(function (err, trajets) {
          if (err){
            console.log("ERR : ");
            console.log(err);
          }else {
            console.log("resultats OK : " + trajets.length);
            callback(null, trajets);
          }
          // console.log(trajets.length + " trajets correspondants trouvés");
          // console.log(trajets[0]);

        });
      },
      completeDriverData, // complete les trajets avec les données sur leurs conducteurs
      completeVehicleData,
      function (trajets, callback) { // filtrer les conducteurs trop bas
        let trajetsCleaned = [];

        for(let trajet of trajets){ // filtrer les conducteurs avec de trop mauvaises evaluations
          if (req.query.evalMin == 0) {
            trajetsCleaned.push(trajet);
          } else if (trajet.driverData.evaluationMoyenne != '?' && trajet.driverData.evaluationMoyenne >= req.query.evalMin) {
            trajetsCleaned.push(trajet);
          }
        }
        callback(null, trajetsCleaned);
      },
      function (trajets, callback) {
        sendRes(res, JSON.stringify(trajets));
        callback(true); // fin du waterfall
      }
    ]);

  });

  // trouve les trajets de villed à villea à partir du dateDepart
  app.get("/trajets/search/:villed/:villea/:dateDepart",function(req,res){

    // var dateOut = req.params.dateDepart; // ex : 2018-01-24
    console.log("Recherche des trajets de " + req.params.villed + " à " + req.params.villea + " à partir du " + req.params.dateDepart);

    async.waterfall([
      function (callback) {
        //primo : extraire les trajets de villed à villea
        database.collection("trajets").find(
          {'depart.ville': {$regex : new RegExp("^" + req.params.villed.toLowerCase(), "i")},
            'arrivee.ville': new RegExp("^" + req.params.villea.toLowerCase(), "i"),
            'date': {$gte: req.params.dateDepart},
            'prix': {$lte: parseInt(req.query.prixMax)}
          },
          {"sort": [[req.query.orderBy,'asc'], ['heure','asc']]}
        ).toArray(function (err, trajets) {
          callback(null, trajets);
        });
      },
      completeDriverData, // complete les trajets avec les données sur leurs conducteurs
      completeVehicleData,
      function (trajets, callback) { // filtrer les conducteurs trop bas
        let trajetsCleaned = [];

        for(let trajet of trajets){
          if (req.query.evalMin == 0) {
            trajetsCleaned.push(trajet);
          } else if (trajet.driverData.evaluationMoyenne != '?' && trajet.driverData.evaluationMoyenne >= req.query.evalMin) {
            trajetsCleaned.push(trajet);
          }
        }
        callback(null, trajetsCleaned);
      },
      function (trajets, callback) { // complete les trajets avec les données sur leurs conducteurs
        sendRes(res, JSON.stringify(trajets));
        callback(true); // fin du waterfall
      }
    ]);
  });

  // Recherche des trajets proposés par un conducteur
  app.get("/trajets/driver/:conducteur_id",function(req,res){

    console.log("Recherche des trajets du conducteur  " + req.params.conducteur_id);

    var results = database.collection("trajets").find({'conducteur': req.params.conducteur_id});

    results.toArray(function(err,documents){
      //récuperation du résultat
      var json = JSON.stringify(documents);
      sendRes(res, json)
    });
  });

  // propose un nouveau trajet
  app.post('/trajets', function (req, res) {

    if(!req.body){
      console.log('bad request : POST sans body');
      return res.sendStatus(400);
    }

    console.log("Ajout d'un trajet : ");
    console.log(req.body);

    var trajet = {
      "depart" : {"ville" : req.body.villeDepart, "adresse" : req.body.adresseDepart},
      "arrivee" : {"ville" : req.body.villeArrivee, "adresse" : req.body.adresseArrivee},
      "date" : req.body.dateDepart,
      "heure" : req.body.heureDepart,
      "prix" : parseFloat(req.body.prix),
      "nbPlaces" : req.body.nbPlaces,
      "conducteur" : req.body.conducteur,
      "passager" : [],
      "vehicule": req.body.selectedVehicule,
      "directions": req.body.directions // lat et lng
      // "status" : "published"
    };

    console.log("Ajout d'un trajet " + trajet.depart.ville + ' ->' + trajet.arrivee.ville);
    console.log(trajet);

    database.collection("trajets").insertOne(trajet, function (err, documents) {
      if (err) {
        console.log('ERROR : \n' + err);
      }
      sendRes(res, JSON.stringify(documents));
    });

  });

  //soumet une reservation d'un utilisateur pour un trajet, via PUT (unused / to remove ?)
  // unused ?
  // app.put("/reservation/:userID/:tripID",function(req,res){
  //
  //   var reservation = {
  //     'userID' : req.params.userID,
  //     'tripID' : req.params.tripID
  //   };
  //
  //   console.log("Ajout d'une reservation");
  //
  //   database.collection("trajets").insertOne(reservation, function (err, documents) {
  //     if (err) {
  //       console.log('ERROR : \n' + err);
  //     }
  //     sendRes(res, JSON.stringify(documents));
  //   });
  //
  // });

  //soumet une reservation d'un utilisateur pour un trajet, via POST
  app.post('/reservation', function (req, res) {

    if(!req.body){
      console.log('bad request : POST sans body');
      return res.sendStatus(400);
    }


    console.log("Ajout d'une reservation");

    var oid = new ObjectID(req.body.tripID);

    database.collection('trajets').update(
      { _id: oid },
      { $push: { 'passager': req.body.userID } }
    );

    sendRes(res, JSON.stringify({'status'  :'OK'}));

  });

  //annule une reservation
  app.post('/reservation/remove', function (req, res) {

    if(!req.body){
      console.log('bad request : POST sans body');
      return res.sendStatus(400);
    }

    console.log("Annulation d'une reservation");

    var oid = new ObjectID(req.body.tripID);

    database.collection('trajets').update(
      { _id: oid },
      { $pull: { 'passager': req.body.userID } }
    );

    sendRes(res, JSON.stringify({'status'  :'OK'}));

  });


  //un admin force la maj de la date d'un trajet
  app.post('/trajets/update/updateDate', function (req, res) {

    if(!req.body){
      console.log('bad request : POST sans body');
      return res.sendStatus(400);
    }

    const tripID = req.body._id;
    var oid = new ObjectID(tripID);

    const date = req.body.date;
    console.log("Mise a jour de la date du trajet " + tripID);

    database.collection('trajets').find().forEach(function (document) {

      database.collection('trajets').update(
        {_id : oid},
        {$set: {'date': date}}
      );
    });

    var ret = {'status': 'OK'};

    sendRes(res, JSON.stringify(ret));

  });

  // trajets reserves par l'user :userID
  app.get("/reservations/:userID",function(req,res){

    console.log('Recherche des trajets reserves par userID : ' + req.params.userID);
    database.collection("trajets").find( {"passager": [ req.params.userID ]} )
    // database.collection("membres").find( {"_id.$oid": req.params.id} )
      .toArray(function(err,documents){
        var json = JSON.stringify(documents);
        sendRes(res, json);
      });
  });

  // trajet par id (trip-details)
  app.get("/trajets/id/:id",function(req,res){

    console.log("Recherche du trajet id: " + req.params.id);

    var oid = new ObjectID(req.params.id);

    async.waterfall([
      function (callback) {
        //primo : extraire les trajets de villed à villea
        database.collection("trajets").find( {"_id": oid} )
          .toArray(function(err,trajets){
            callback(null, trajets);
          });
      },
      completeDriverData, // complete les trajets avec les données sur leurs conducteurs
      function (trajets, callback) {
        sendRes(res, JSON.stringify(trajets));
        callback(true); // fin du waterfall
      }
    ]);
  });

  /**
   * Vehicules
   */


  //requête tous les membres
  app.get("/vehicules",function(req,res){
    console.log("Recupération des vehicules");
    database.collection("vehicules").find()
      .toArray(function(err,documents){
        var json=JSON.stringify(documents);
        sendRes(res, json);
      });
  });


  // trouve les vehicules du membre :ownerId
  app.get("/vehicules/driverId/:ownerId", function (req, res) {
    console.log("Recherche des vehicules du membre d'id: " + req.params.ownerId);

    async.waterfall([
      // Primo : recherche du proprietaire par ID
      function (callback) {
        var oid = new ObjectID(req.params.ownerId);
        database.collection("membres").find( {"_id": oid} )
          .toArray(function(err,membres){
            callback(null, membres[0]);
          });
      },
      // Deuxio : renvoie les infos des vehicules
      function (membre, callback) {

        for (let vid of membre.vehicule_ids) {
          vid = ObjectID(vid);
        }

        database.collection("vehicules").find( {"_id": {$in : membre.vehicule_ids}} )
          .toArray(function(err,vehicules){

            sendRes(res, JSON.stringify(vehicules));
            callback(true);// fin du waterfall
          });
      }
    ]);

  });

  // ajoute une nouvelle voiture
  app.post('/vehicules', function (req, res) {

    if (!req.body) {
      console.log('bad request : ' + req.body);
      return res.sendStatus(400);
    }

    var vehicule = {
      "marque": req.body.marque,
      "modele": req.body.modele,
      "couleur": req.body.couleur
    };


    console.log("Ajout d'un vehicule");
    console.log(vehicule);

    database.collection("vehicules").insertOne(vehicule, function (err, documents) {
      if (err) {
        console.log('ERROR : \n' + err);
      }else {
        console.log('vehicule ajouté :');
        console.log(vehicule);

        console.log('association avec le conducteur ' + req.body.ownerID);

        var oid = new ObjectID(req.body.ownerID);

        database.collection('membres').update(
          { _id: oid },
          { $push: { 'vehicule_ids': vehicule._id } }
        )

      }

      sendRes(res, JSON.stringify(documents));
    });
  });


  /**
   * Mises a jour exceptionnelles de la base : DEBUG ONLY
   */
  app.get("/trajets/maj/parsepricestoint", function (req, res) {

    var convert = function(document){
      var prix = document.prix || Math.floor(Math.random() * (25 - 5 + 1)) + 5;
      var intValue = parseInt(prix);
      database.collection('trajets').update(
        {_id : document._id},
        {$set: {'prix': intValue}}
      );
    };

    database.collection('trajets').find().forEach(convert);

    res.sendStatus(200);
  });

  app.get("/membres/maj/removeVehicules", function (req, res) {

    var resetvehicules = function(document){
      database.collection('membres').update(
        {_id : document._id},
        {$set: {'vehicule_ids': []}}
      );
    };

    database.collection('membres').find().forEach(resetvehicules);

    res.sendStatus(200);
  });

  app.get("/membres/maj/removeEvaluations/:mail", function (req, res) {

    var resetevaluations = function(document){
      database.collection('membres').update(
        {_id : document._id},
        {$set: {'evaluations': []}}
      );
    };

    database.collection('membres').find({'mail': req.params.mail}).forEach(resetevaluations);

    res.sendStatus(200);
  });

  app.get("/membres/maj/removeMembre/:mail", function (req, res) {

    database.collection('membres').remove({'mail': req.params.mail});
    // db.products.remove( { qty: { $gt: 20 } } )


    res.sendStatus(200);
  });

});








app.listen(8888);
