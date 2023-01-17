// D'abord, il faut appeller les paquets NPM pour faire fonctionner les différents middlewares
// Nous utilisons express, cors et morgan, donc je les "require" avec leur nom entre '' 
// require va chercher le dossier node_modules pour ces middleware sauf si nous mettons un ./ avant
const express = require('express')
const cors = require('cors');
const morgan = require('morgan');

// j'ai créé un fichier "config.json" pour maintenir les parametres serveur. 
// ce fichier étant hors "node_modules" j'utilise ./ pour le localiser
const config = require('./config');

// j'utilise ./ pour appeller le dossier "routes".  
// Node va chercher un fichier .js ou .json par défaut. Comme "routes" est un dossier et que je ne précise pas le nom du fichier, node va chercher index.js dans mon dossier "routes" et va y trouver le fichier index.js.
const routes = require('./routes');
// pour créer un serveur, je crée un const qui require express
const app = express();

// j'applique les middlewares, morgan et cors, morgan pour les logs dans le console pour aider a débugger
app.use(morgan('dev'));
  
// deuxieme middleware cors pour gerer les en-têtes HHTP cross origin resource sharing:  (https://developer.mozilla.org/fr/docs/Glossary/CORS) pour permettre à utiliser plus que POST GET et HEAD sans etre refuse par le serveur
app.use(cors());


// troisieme : la partie json du paquet Express, pour qu'Express puisse parser le JSON qui est envoyé dans le corps "body" des requetes
app.use(express.json());

// je dis à mon app d'utiliser notre router (qui se trouve dans routes/index.js) sur l'adresse "/api". A partir de la, je vais créer toutes les routes sur "http://localhost/api/{entité}..."
app.use(config.basePath, routes);

// je dis a mon serveur Express de regarder le port - infos dans config.json pour fonctionner sur le port 80 - port par defaut de http.
app.listen(config.port, () => {
  console.log("mynps app up and server listening on port " + config.port);
});
