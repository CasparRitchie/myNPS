// j'utilise promise de mysql2 qui permet d'utiliser les commandes async / await sur 
// les requetes, ou mysql ne le permet pas
const mysql = require('mysql2/promise');
// j'appelle également mon fichier config pour les infos serveur
const config = require('../config');

// une autre spécificité de mysql2 est qu'on fait createPool au lieu de createConnection
// ici j'ajoute les informations de mon serveur MySQL

const db = mysql.createPool({
    host: config.mysqlHost,
    user: config.mysqlUsername,
    password: config.mysqlPassword,
    database: config.mysqlDatabase
});
// j'exporte db ce qui me permet d'appeller juste "db" un faisant
// un require(utils/db) pour eviter de devoir re ecrire les identifiants
// dans les autres fichiers du projet
module.exports = db;