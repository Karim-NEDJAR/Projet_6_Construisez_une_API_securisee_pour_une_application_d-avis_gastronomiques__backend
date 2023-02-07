const express = require("express");
const mongoose = require ("mongoose");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config({ path: process.cwd() + "/.env" });

// connection à la bdd mongoDB via le package mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_URL}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB: OK "))
  .catch(() => console.log("Connexion à MongoDB : K O "));

  //l'application express  piiquante
  const piiquante = express();

//pour le CORS   
piiquante.use((req, res, next) => {
  //on accepte les connections depuis une origine différente
    res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

  // pour parser le body de la requête en objet json  (à la place de body-parser)
  piiquante.use(express.json());
  
  //les bases des routes (segment initial)
  piiquante.use("/images", express.static(path.join(__dirname, "images")));
  piiquante.use("/api/sauces", sauceRoutes);
  piiquante.use("/api/auth", userRoutes);
  
module.exports = piiquante;
