const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const salage = 10;

//inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, salage)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Nouvel utilisateur enregistré !" }))
                //l'enregistrement a échoué
                .catch(error => res.status(400).json({ error }));
        })
        //l'opération de hashage a échoué
        .catch(error => res.status(500).json({ error }));
};


//connexion 
//utiliser une variable d'environnement?
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                //adresse email  non trouvée
                return res.status(401).json({ message: "Login et/ou mot de passe incorrect(s)" });
            }
            //l'adresse email existe, on compare les mots de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        //les mots de passe  ne coïncident pas
                        return res.status(401).json({ message: "Login et/ou mot de passe incorrect(s)" });
                    }
                    // le mot de passe saisi coïncide , 
                    //on fournit un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        )
                    });
                })
                //la comparaison a échoué
                .catch(error => res.status(500).json({ error }));
        })
        // adresse email non trouvée
        .catch(error => res.status(500).json({ error }));
};