const express = require("express");
const mongoose = require ("mongoose");
//const bodyParser = require("body-parser"); 
const sauceRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');
const path = require('path');

// connection à la bdd mongoDB via le package mongoose
mongoose.connect("mongodb+srv://karim:karim@cluster0.giirsuc.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  const piiquante = express();
//pour le CORS   
piiquante.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});


 

  //bodyParser pour parser le body de la requête en objet json 
  piiquante.use(bodyParser.json());
  
  //les routes
  piiquante.use('/images', express.static(path.join(__dirname, 'images')));
  piiquante.use("/api/sauces", sauceRoutes);
  piiquante.use('/api/auth', userRoutes);
  

module.exports = piiquante;
