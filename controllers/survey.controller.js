  // Import de la bibliothèque de gestion de la base de données
  const db = require('../utils/db');
  //puis je crée les fonctions async pour récuperer les données de la bdd
  // Fonction async pour ajouter un nouveau sondage dans la base de données
  const add = async (data) => {
  // Récupération de la date courante

      const dateNow = new Date();
      // Requête SQL d'ajout du nouveau sondage dans la base de données
      // La fonction "query" retourne un tableau avec deux éléments : la requête et une erreur (s'il y en a une)

      const [req, err] = await db.query("INSERT INTO surveyResponses (score, comment, submitted_date, id_users_submit_survey) VALUES (?,?, ?, ?)",
      [data.score, data.comment, dateNow, 1]);
      // Si la requête échoue, on retourne "null"
      if(!req) {      
          return null;
      }
      // une fois que l'ajout de sondage a été réussi, j'appelle la fonction getById pour récuperer le ID du nouvel sondage 
      return getById(req.insertId);
  }
  
  // ********* vieux fonction pour checker si ca marche le getAll tout simple ******
  const getAll = async () => {
    const [surveys, err] = await db.query("SELECT * FROM surveyResponses ORDER BY submitted_date DESC");
    return surveys;
}; 
// ******* fin de vieux fonction *******

  // Fonction pour récupérer tous les sondages de la base de données
  // const getAll = async (auth) => {
  //     try {
  //       // Si l'utilisateur a le rôle d'admin ou de user, j'autorise la récupération de tous les sondages

  //       if (auth.role === 'admin' || (survey.user_id == req.auth.id)) {
    // const [surveys, err] = await db.query("SELECT * FROM surveyResponses ORDER BY submitted_date DESC");
          // if (err) {
  //           throw new Error(err);
  //         }
  //         return surveys;
  //         // Sinon, je n'autorise la récupération que des sondages soumis par l'utilisateur en question

  //       } else {
  //         const [response, err] = await db.query("SELECT * FROM surveyResponses where id_users_submit_survey = ?", [auth.id])
  //         if (err) {
  //           throw new Error(err);
  //         }
  //         return response;
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       console.log("An error occurred fetching survey data")
  //       return {
  //         success: false,
  //         message: "An error occurred while trying to fetch the survey data from the database"
  //       };
  //     }
  //   }
    
    const getById = async (id) => {
      // On exécute une requête SQL qui sélectionne tous les champs de la table surveyResponses où l'ID est égal à l'ID passé en paramètre
      const [survey, err] = await db.query("SELECT * FROM surveyResponses WHERE id = ?", [id]);
      // Si la requête n'a pas abouti ou si le tableau retourné est vide, on retourne null
      if(!survey || survey.length == 0) {
          return null;
      }
      // Sinon, on retourne le premier élément du tableau (il ne devrait y en avoir qu'un seul puisque l'ID est unique)
      return survey[0];
    } 
    

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