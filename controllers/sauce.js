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
    //suppression de l'id qui est généré automatiquement lors de la création de la sauce
    // et de l'userId pour le récupérer de la bdd (fourni par le middleware d'authentification)
    delete sauceObject._id; //????
    delete sauceObject._userId; // supprimé puis réaffecté avec la valeur sûre provenant de l'authentification
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json(); })
        .catch((error) => { res.status(400).json({ error: error }); });
};
// FIN création d'une sauce

//modification d'une sauce (update)
exports.updateSauce = (req, res, next) => {
    //2 cas sont à considérer: un cas avec  image et un cas sans image
    //si une image accompagne la requête, on lui affecte son url
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
    // delete sauceObject._userId; // suppression inutile ??  réaffecté après le test positif
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Accès non autorisé" });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Modification effectuée." }))
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
                        .then(() => { res.status(200).json({ message: "Sauce supprimée !" }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });

};
//fin suppression sauce


// likeStatus (l'état de l'indicateur "like": 0 ou 1 ou -1)
exports.likeStatus = (req, res, next) => {

    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: 1 }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: "You like !" }))
            .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: "You dislike !" }))
            .catch(error => res.status(400).json({ error }))
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({ message: "No like anymore" }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => { res.status(200).json({ message: "No dislike anymore" }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
    
}; 
//fin likeStatus 

