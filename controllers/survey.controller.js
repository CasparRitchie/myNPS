const db = require('../utils/db');
//puis je crée les fonctions async pour récuperer les données de la bdd
const add = async (data) => {

    const dateNow = new Date();

    const [req, err] = await db.query("INSERT INTO surveyResponses (score, comment, submitted_date, id_users_submit_survey) VALUES (?,?, ?, ?)",
    [data.score, data.comment, dateNow, 1]);
    if(!req) {
        return null;
    }
    // une fois que l'ajout de user a été réussi, j'appelle la fonction getById pour récuperer le ID du nouvel utilisateur 
    return getById(req.insertId);
}; 
const getAll = async () => {
    const [surveys, err] = await db.query("SELECT * FROM surveyResponses");
    return surveys;
}; 
const getById = async (id) => {
    const [survey, err] = await db.query("SELECT * FROM surveyResponses WHERE id = ?", [id]);
    if(!survey || survey.length == 0) {
        return null;
    }
    return survey[0];
}; 
// j'exporte mes fonctions
module.exports = {
    getAll,
    getById,
    add,
};