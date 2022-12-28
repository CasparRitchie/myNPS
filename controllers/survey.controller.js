const db = require('../utils/db');
//puis je crée les fonctions async pour récuperer les données de la bdd
const add = async (data) => {

    const dateNow = new Date();

    const [req, err] = await db.query("INSERT INTO surveyResponses (score, comment, submitted_date, id_users_submit_survey) VALUES (?,?, ?, ?)",
    [data.score, data.comment, dateNow, 1]);
    if(!req) {
        return null;
    }
    // une fois que l'ajout de sondage a été réussi, j'appelle la fonction getById pour récuperer le ID du nouvel sondage 
    return getById(req.insertId);
}; 

const getAll = async (auth) => {
    if (auth.roles == 'admin') {
        const [surveys, err] = await db.query("SELECT * FROM surveyResponses");
    return surveys;
    } else {
        const [response, err] = await db.query("SELECT * FROM surveys where id_users_submit_survey = ?", [auth.id])
    }
};

const getById = async (id) => {
    const [survey, err] = await db.query("SELECT * FROM surveyResponses WHERE id = ?", [id]);
    if(!survey || survey.length == 0) {
        return null;
    }
    return survey[0];
}; 

const getNPSData = async () => {
    const [surveys, err] = await db.query(`SELECT month,
        -- Calculate the NPS for the current month
        (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
        FROM survey_responses s
        WHERE s.month = month AND rating BETWEEN 9 AND 10)
        -
        (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
        FROM survey_responses s
        WHERE s.month = month AND rating BETWEEN 0 AND 6) AS nps,
        -- Calculate the rolling average NPS for the past 12 months
        AVG(
            (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
            FROM survey_responses s
            WHERE s.month = month AND rating BETWEEN 9 AND 10)
            -
            (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
            FROM survey_responses s
            WHERE s.month = month AND rating BETWEEN 0 AND 6)
            ) OVER (ORDER BY month ROWS BETWEEN 11 PRECEDING AND CURRENT ROW) AS rolling_average_nps,
            -- Calculate the percentage of Promoters for the current month
            (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)FROM survey_responses s WHERE s.month = month AND rating BETWEEN 9 AND 10) AS promoters,
     -- Calculate the percentage of Passives for the current month
     (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month) FROM survey_responses s
     WHERE s.month = month AND rating BETWEEN 7 AND 8) AS passives,
     -- Calculate the percentage of Detractors for the current month
     (SELECT COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses WHERE month = s.month)
     FROM survey_responses s
     WHERE s.month = month AND rating BETWEEN 0 AND 6) AS detractors
     FROM (
         -- Generate a list of months to use as the x-axis for the chart
         SELECT DISTINCT month FROM survey_responses ORDER BY month
         ) months
         `);
         return rows;
        };
    
// j'exporte mes fonctions
module.exports = {
    getAll,
    getById,
    add,
    getNPSData

};