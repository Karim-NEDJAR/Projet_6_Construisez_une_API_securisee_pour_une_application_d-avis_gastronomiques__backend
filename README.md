# Projet 6: Construisez une API sécurisée pour une application d'avis gastronomiques

---

## Contexte:

La marque _Piiquante_ qui commercialise des condiments à base de piment veut développer une application web de critique des sauces piquantes appelée **Hot Takes**. la première version de **Hot Takes** sera d'abord une galerie de sauces permettant aux utilisateurs de télécharger leurs sauces piquantes préférées et de liker ou disliker les sauces que d'autres partagent.

## Objectif : création d'un backend pour un frontend existant

Le frontend de l'application **Hot Takes** est prêt, il faut la compléter avec le backend correspondant.

## Les outils mis en oeuvre

NodeJS version 18.13.0
express version 4.18.2
(à partir de la version 4.16 d'Express,
body-parser est inclus)
mangoose version 6.9.0
MongoDB (base de données NoSQL) version 5.0.14
MongoDB Atlas: https://www.mongodb.com/cloud/atlas
(driver Node.JS : 4.1 or later)
mongoose-unique-validator: 3.1.0
bcrypt: 5.1.0
jsonwebtoken": 9.0.0 (=jwt)
multer: 1.4.5-lts.1
nodemon: 2.0.20
dotenv: 16.0.3
et d'autres... voir _package.json_

---

## Format du mot de passe

Il est attendu que le mot de passe respecte le format exigé par défaut par le package "validator" (commande: `npm install validator --save` ).
Voir la documentation: https://www.npmjs.com/package/validator  
Rechercher dans la page la méthode: isStrongPassword (string)
En résumé: Il faut 8 caractères minimum,  
avec au moins 1 chiffre, 1 majuscule, 1 minuscule et 1 caractère spécial.

## Le format d'un email valide

il est attendu que l'email respecte le format défini par défaut par le package "validator".
Voir la documentation: https://www.npmjs.com/package/validator  
Rechercher dans la page la méthode: isEmail (string)
Plus de détails ici: **https://github.com/validatorjs/validator.js/blob/master/src/lib/isEmail.js**  
Les développeurs du frontend ont semble-t-il mis des restrictions sur les lettres accentuées dans l'email puisqu'en leur présence le bouton de submit reste désactivé.

## Dernières modifications effectuées (le 22/02/2023)

- Ajout du plugin _mongoose-mongodb-errors_ pour la gestion des erreurs provenant de MongoDB (voir les schémas).
- Vérification de la solidité du mot de passe avec le module _validator_ et messages d'erreurs le cas échéant.
- Vérification, avec le module _validator_, de la validité formelle de l'adresse email saisie par l'utilisateur et messages d'erreurs le cas échéant.
- Connection à MongoDB à l'aide d'une seule variable d'environnement en remplacement de la concaténation de plusieurs (voir _piiquante.js_).
- Empêchement de l'upload d'un fichier qui n'est pas une image (voir _middleware/multer-config.js_). Cependant, cette vérification ne peut empêcher l'upload d'un fichier d'une autre nature s'il a été frauduleusement renommé avec une extension d'image. Le véritable format du fichier (mp3, mp4, pdf,...) est caché par l'extension sustituée. Il faut un autre moyen pour découvrir en amont la véritable nature du fichier (Récupérer les métadonnées? Lire les en-têtes de fichier?).

### Livraison du dossier compressé

La compression et l'envoi se feront sans le répertoire _node_modules_
Information: la plateforme de dépôt des fichiers livrables renommera automatiquement le zip en un nom différent de celui demandé dans les instructions écrites.
