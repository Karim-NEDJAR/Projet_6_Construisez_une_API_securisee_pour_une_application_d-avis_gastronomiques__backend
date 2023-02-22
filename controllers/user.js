const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const salage = 10;

//inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  //we want to be sure the given password / email is not a number
  //because validator accepts strings only...
  try {
    let passwordString = req.body.password + "";
    let emailString = (req.body.email + "").toLowerCase();
    //affichage des saisies
    console.log(
      validator.isStrongPassword(passwordString)
        ? "\nPassword is strong"
        : "\nPassword is not strong enough \n Expected: " +
            "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
    );
    console.log(
      validator.isEmail(emailString)
        ? `\n ${emailString} : this email is valid`
        : `\n ${emailString} : this Email is not valid \n Example of valid email: jacques.prevert@cancre.fr  (without accent)`
    );
    // vérification et traitement des saisies
    if (!validator.isStrongPassword(passwordString)) {
      //we are here in this block  because the password is not strong enough
      return res.status(400).json({
        Erreur:
          "Mot de passe trop faible: il faut 8 caractères minimum, avec au moins 1 chiffre, 1 majuscule, 1 minuscule et 1 caractère spécial.",
      });
    } else if (!validator.isEmail(emailString)) {
      //we are here in this block  because the email is invalid
      return res.status(400).json({
        Erreur:
          "Email invalide. Exemple d'email valide: cigarra.hormiga@jeandelafontaine.fr",
      });
    } else {
      bcrypt
        .hash(req.body.password, salage)
        .then((hash) => {
          const user = new User({ email: req.body.email, password: hash });
          user
            .save()
            .then(() =>
              res
                .status(201)
                .json({ message: "Nouvel utilisateur enregistré !" })
            )
            .catch((error) => res.status(400).json({ error }));
        })
        //l'opération de hashage a échoué
        .catch((error) => res.status(500).json({ error }));
    }
  } catch (error) {
    res.status(401).json({ error: error });
  }
};

//connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        //adresse email  non trouvée
        return res
          .status(401)
          .json({ message: "Login et/ou mot de passe incorrect(s)" });
      }
      //l'adresse email existe, on compare les mots de passe
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            //les mots de passe  ne coïncident pas
            return res
              .status(401)
              .json({ message: "Login et/ou mot de passe incorrect(s)" });
          }
          // le mot de passe saisi coïncide ,
          //on fournit un token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, {
              expiresIn: "24h",
            }),
          });
        })
        //la comparaison a échoué
        .catch((error) => res.status(500).json({ error }));
    })
    // adresse email non trouvée
    .catch((error) => res.status(500).json({ error }));
};
