const express = require('express');
// Importation du contrôleur des enquêtes
const surveyController = require('../controllers/survey.controller');
// Importation du schéma de l'enquête (peut-être utilisé pour la validation des données côté serveur)
const surveySchema = require('../models/survey');
// Importation d'un outil de validation des données (peut-être utilisé pour la validation des données côté serveur)
const validator = require('../utils/validator');
// Importation d'un outil de validation de l'authentification (peut-être utilisé pour vérifier que l'utilisateur est authentifié avant de lui permettre d'accéder à certaines routes)
const authValidator = require('../utils/auth');
// Création d'un nouvel objet de routeur avec Express
const router = express.Router();
// je définis les routes qui vont se situer sur "/"

// POST = create
// PUT / PATCH = update
router.route('/')
.get(async (req, res) => {
    const surveys = await surveyController.getAll();
    if (!surveys) {
        res.status(404).json();
    }
        res.status(200).json(surveys);
})

// .get(async (req, res) => {
//     // Récupération de toutes les enquêtes auprès du contrôleur des enquêtes
//     const surveys = await surveyController.getAll();
//     // Si aucune enquête n'est trouvée, renvoie d'une réponse 404
//     if (!surveys) {
//         res.status(404).json();
//     }
//     // Renvoie d'une réponse 200 avec les enquêtes trouvées
//     res.status(200).json(surveys);
// })
        // Création d'une nouvelle enquête
    .post(async (req, res) => {
        const new_survey = await surveyController.add(req.body);
        if (!new_survey) {
            res.status(404).json();
        }
        res.status(200).json(new_survey);
    })
    ;
        // pour les routes ou il faut savoir duquel survey on parle
        // et toutes ces routes seront sur le chemin "/:id"
        
    router.route('/:id')
    // on appelle la fonction getById
    // Methode HTTP GET pour cette requete Récupération d'une enquête spécifique en fonction de son identifiant
    .get(authValidator.isAuth(), async (req, res) => {
        const survey = await surveyController.getById(req.params.id);
        if (req.auth.role != "admin" && (survey.id_users_submit_survey != req.auth.id)) {
            res.status(403).json({message: "C'est pas ton sondage"});
            // Si aucune enquête n'a été trouvée
        } else if (!survey) {
                res.status(404).json();
        } else {
        // Si l'enquête est trouvée et que l'utilisateur a les droits d'accès, renvoie un statut 200 avec l'enquête
            res.status(200).json(survey);
        }
    })
// Supprime l'enquête en fonction de son ID
.delete(async (req, res) => {
    // Appelle la fonction remove du controlleur de l'enquête avec l'ID de l'enquête récupéré dans l'URL
    const survey = await surveyController.remove(req.params.id)
    if(!survey) {
        res.status(404).json();
            } else {

                res.status(202).json()
            }
    })
;
router.route('/ShowChart')
// Obtention de tous les sondages
.get(async (req, res) => {
// On appelle la fonction getAll du contrôleur de sondages pour récupérer tous les sondages
const surveys = await surveyController.getAll();
// Si on ne récupère aucun sondage
if (!surveys) {
// On renvoie un code d'erreur 404 avec une réponse vide
res.status(404).json();
} else {
    // Si on récupère des sondages, on renvoie un code de succès 200 et la liste de sondages
    res.status(200).json(surveys);
}
})

    // Je crée un "show" pour le nouveau complexe fonction pour les données NPS
    // ********** Cette fonction n'est pas terminée 20230103 ******************
router.route('/ShowChartData')    
    .get(async (req, res) => {
        // change to charts and chartsController
        const surveys = await surveyController.getAll();
            // change to charts 
            if (!surveys) {
                res.status(404).json();
            }
            // change to charts
            res.status(200).json(surveys);
    })
// ****************** fonction à terminer *********************
    module.exports = router;