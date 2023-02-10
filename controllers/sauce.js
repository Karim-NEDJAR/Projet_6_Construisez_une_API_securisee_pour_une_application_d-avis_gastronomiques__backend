const Sauce = require("../models/sauce");
const fs = require("fs");

//récupération de toutes les sauces
exports.readSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => { res.status(200).json(sauces); })
        .catch((error) => { res.status(400).json({ error: error }); });
};

// récupération d'une sauce
exports.readSingleSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce); })
        .catch((error) => { res.status(404).json({ error: error }); });

};

// création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const reg =/^[^\d\W].+$/ ;
    if (reg.test(sauceObject.name) && reg.test(sauceObject.manufacturer) && reg.test(sauceObject.description) && reg.test(sauceObject.mainPepper)) {
    delete sauceObject._id; 
    //suppression ci-dessus de l'id qui sera recréé automatiquement lors de la création de la sauce
    // et ci-dessous de l'userId pour le récupérer de la bdd (fourni par le middleware d'authentification)
    delete sauceObject._userId; // supprimé puis réaffecté avec la valeur sûre provenant de l'authentification
        const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    // console.log("createSauce --> req.file.filename :  " + req.file.filename);
    sauce.save()
        .then(() => {
            res.status(201).json({ message: "Sauce créée" });
        })
        .catch((error) => { res.status(400).json({ error: error }); });
    } else {res.status(400).json({ message: "SAISIE INVALIDE: \nIl faut au moins 2 caractères dont le premier doit être une lettre alphabétique" }); }
};
// FIN création d'une sauce

//modification d'une sauce (update)

exports.updateSauce = (req, res, next) => {
    //2 cas sont à considérer: un cas avec une nouvelle image 
    //et un cas sans nouvelle image
    //si une image accompagne la requête, on lui affecte son url 
    //et on supprime éventuellement l'ancienne image
    //si pas d'image on récupère seulement le body de la requête
    let suppressOldImage = false;
    let sauceObject = req.file;
    if (sauceObject) {
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        };
        suppressOldImage = true;
    } else {
        sauceObject = { ...req.body };
    };

    // delete sauceObject._userId; // suppression (préconisée dans le cours) qui semble ici inutile 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Accès non autorisé" });
            } else {
                //ici on a trouvé la sauce et elle appartient réellement à l'utilisateur authentifié
                // donc il a le droit de la modifier; 
                //il faut également supprimer  l'image du file system
                //on récupère (avant le lancement de updateOne) le nom de l'image qui se trouve dans le répertoire 
                if (suppressOldImage) {
                    const filename = sauce.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) throw err;
                        console.log("Ancienne image supprimée du support physique ! Filename: " + filename);
                    });
                }
                //maintenant on peut faire la modification
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Modification de la sauce effectuée." }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
// fin modification d'une sauce

//suppression d'une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Accès non autorisé" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Sauce supprimée !" });
                        })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });

};
//fin suppression sauce

// likeStatus (l'état de l'indicateur "like": 0 ou 1 ou -1) et remplissage des tableaux

exports.likeStatus = (req, res, next) => {
    //on vérifie que like est un entier valant 0 ou 1 ou -1 (voir regex)
    let patternIsValid = false;
    let positif = false;
    let negatif = false;
    let neutre = false;
    const int = parseInt(req.body.like);
    if (!isNaN(int)) patternIsValid = /^(0|1|-1)$/.test(int);
    if (patternIsValid && int == 1) positif = true;
    if (patternIsValid && int == -1) negatif = true;
    if (patternIsValid && int == 0) neutre = true;

    if (positif) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: "You like !" }))
            .catch(error => res.status(400).json({ error }))
    } else if (negatif) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: "You dislike !" }))
            .catch(error => res.status(400).json({ error }))
    } else if (neutre) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({ message: "Your like is removed" }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => { res.status(200).json({ message: "Your dislike is removed" }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }));
    } else {
        res.status(400).json({ error });
    }

};
//fin likeStatus


