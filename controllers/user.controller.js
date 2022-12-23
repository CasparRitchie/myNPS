// j'appelle le middleware bcrypt
const bcrypt = require('bcrypt');

// puis j'appelle le db que j'ai créer pour contenir les infos connexion mysql
const db = require('../utils/db');

// puis je crée les fonctions async pour appeller la bdd
const add = async (data) => {
    const dateNow = new Date();
    const [req, err] = await db.query("INSERT INTO users (salutation, first_name, last_name, nationality, date_of_birth, email, password, created_date) VALUES (?,?,?,?,?,?,?,?)",
    [data.salutation, data.first_name, data.last_name, data.nationality, data.date_of_birth, data.email, data.password, dateNow]);
    if(!req) {
        return null;
    }
    // une fois que l'ajout de user a été réussi, j'appelle la fonction getById pour récuperer le ID du nouvel utilisateur 
    return getById(req.insertId);
};
const getAll = async () => {
    const [users, err] = await db.query("SELECT id, salutation, first_name, last_name, date_of_birth, email, nationality, created_date, `role` FROM users");
    return users;
};
const getById = async (id) => {
    const [user, err] = await db.query("SELECT * FROM users where id = ?", [id]);
    if(!user || user.length == 0) {
        return null;
    } 
        return user[0];
};

const update = async (id, data) => {
    // Pour update, on va chercher en base le user correspondant au ID
    const user = await getById(id);
    if (!user) {
        return null;
    } else {
        // On met à jour, en réécrivant les champs potentiellement manquant, grace au user récupéré
        const [req, err] = await db.query("UPDATE users SET salutation = ?, first_name = ?, last_name = ?, nationality = ?, date_of_birth = ?, email = ?, password = ?, repassword = ? WHERE id = ? LIMIT 1", 
        [
            data.salutation || user.salutation,
            data.first_name || user.first_name,
            data.last_name || user.last_name,
            data.nationality || user.nationality,
            data.date_of_birth || user.date_of_birth,
            data.email || user.email, 
            data.password || user.password,
            data.repassword || user.repassword,
            id
        ]);
        if (!req) {
            return null;
        }
        // Je retourne le user modifié pour montrer que tout se passe bien
        return getById(id);
    }}
    
;
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM users WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};


module.exports = {
    add,
    getAll,
    getById,
    update,
    remove,
  };