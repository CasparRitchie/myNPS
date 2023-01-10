// j'appelle le middleware bcrypt
const bcrypt = require('bcrypt');
// puis j'appelle le db que j'ai créé pour contenir les infos connexion mysql
const db = require('../utils/db');
// puis je crée les fonctions async pour appeller la bdd
const add = async (data) => {
// Hashage du mot de passe avant insertion dans la base de données
    const hashedPassword = await bcrypt.hash(data.password, 10);
// Création de la date actuelle
    const dateNow = new Date();
// Insertion des données de l'utilisateur dans la base de données
    const [req, err] = await db.query("INSERT INTO users (salutation, first_name, last_name, nationality, date_of_birth, email, password, created_date) VALUES (?,?,?,?,?,?,?,?)",
    [data.salutation, data.first_name, data.last_name, data.nationality, data.date_of_birth, data.email, hashedPassword, dateNow]);
// Si la requête d'insertion échoue, on retourne null
    if(!req) {
    return null;
    }
// Si la requête d'insertion a réussi, on appelle la fonction getById pour récupérer le ID du nouvel utilisateur
    return getById(req.insertId);
};

const getAll = async () => {
// Je sélectionne tous les champs de la table users
    const [users, err] = await db.query("SELECT id, salutation, first_name, last_name, date_of_birth, email, nationality, created_date, role FROM users");
// Je retourne tous les utilisateurs trouvés
    return users;
};

const getById = async (id) => {
// Récupère l'utilisateur avec l'ID spécifié à partir de la base de données
    const [user, err] = await db.query("SELECT * FROM users where id = ?", [id]);
// Si l'utilisateur n'existe pas ou si la longueur du tableau de résultats est égale à 0, retourne null
    if(!user || user.length == 0) {
        return null;
    }
// Quand on utilise getByID, on récupère un seul utilisateur, donc on utilise user[0] car on reçoit une réponse sous forme de tableau avec MySQL.
    return user[0];
};

const update = async (id, data) => {
// Pour update, on va chercher en base le user correspondant au ID
    const user = await getById(id);
    if (!user) {
        return null;
    } else {
        let password;
        if (data.password) {
// Si le mot de passe a été modifié, on le hash avec bcrypt avant de l'enregistrer
            password = await bcrypt.hash(data.password, 10);
        } else {
// Sinon, on utilise le mot de passe existant
            password = user.password;
        }
// On met à jour les champs du user en utilisant les données données en paramètre, ou les valeurs existantes si elles n'ont pas été modifiées
        const [req, err] = await db.query("UPDATE users SET salutation = ?, first_name = ?, last_name = ?, nationality = ?, date_of_birth = ?, email = ?, password = ?, WHERE id = ? LIMIT 1", 
        [
            // data.salutation || user.salutation,
            // data.first_name || user.first_name,
            // data.last_name || user.last_name,
            // data.nationality || user.nationality,
            // data.date_of_birth || user.date_of_birth,
            data.email || user.email, 
            password,
            id
        ]);
        if (!req) {
            return null;
        }
        // Je retourne le user modifié pour montrer que tout s'est bien passé 
        return getById(id);
    }
};

// Dans cette fonction, nous allons supprimer l'utilisateur correspondant à l'ID passé en paramètre
const remove = async (id) => {
    // Nous utilisons la fonction "query" de notre objet "db" qui nous permet de faire des requêtes SQL
    // Nous passons en paramètre de cette fonction une requête de type "DELETE" qui va supprimer l'utilisateur correspondant à l'ID passé en paramètre
    // Nous utilisons la clause "LIMIT 1" pour préciser que nous ne voulons supprimer qu'un seul utilisateur, afin d'éviter tout problème potentiel
    const [req, err] = await db.query("DELETE FROM users WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        // Si la requête échoue, nous renvoyons "false"
        return false;
        // Sinon, nous renvoyons "true" pour indiquer que la suppression a été effectuée avec succès
    }
    return true;
};

const getByEmailAndPassword = async (data) => {
    // On récupère l'utilisateur correspondant à l'adresse email donnée
    const user = await getByEmail(data);
    // Si aucun utilisateur n'est trouvé, on retourne null
    console.log('/*****/')
    console.log(data)
    console.log('/*****/')
    if (!user) {
    return null;
    }
    // On compare le mot de passe donné dans data avec le mot de passe haché stocké en base de données
    const hashedPassword = await bcrypt.compare(data.password, user.password);
    // Si les mots de passe correspondent, on retourne l'utilisateur
    if (hashedPassword) {
    return user;
    }
    // Sinon, on retourne null
    else {
    return null;
    }
};

const getByEmail = async (data) => {
    // On effectue une requête pour récupérer l'utilisateur avec l'email spécifié
    const [user, err] = await db.query("SELECT * FROM users WHERE email = ?", [data.email]);
    // Si aucun utilisateur n'a été trouvé, on renvoie null
    if (!user || user.length == 0) {
    return null;
    }
    // On renvoie l'utilisateur trouvé (dans ce cas, il ne devrait y en avoir qu'un seul, donc on prend l'élément 0 de l'array)
    return user[0];
    };
// On exporte toutes les fonctions définies dans ce fichier afin de pouvoir les utiliser dans d'autres fichiers de l'application.
module.exports = {
    add,
    getAll,
    getById,
    update,
    remove,
    getByEmailAndPassword,
    getByEmail
};