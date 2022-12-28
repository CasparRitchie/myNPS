const express = require('express');

const surveyController = require('../controllers/survey.controller');
const surveySchema = require('../models/survey');
const validator = require('../utils/validator');
const authValidator = require('../utils/auth');
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
    .get(authValidator.isAuth(), async (req, res) => {
        const survey = await surveyController.getById(req.params.id);
        if (!survey) {
            res.status(404).json();
        }
        if (req.auth.roles != "admin" && (survey.user_id != req.auth.id)) {
            res.status(403).json({message: "This isn't your survey"});
        } else {
            res.status(200).json(survey);
        }
    })
    .delete(async (req, res) => {
        const survey = await surveyController.remove(req.params.id)
        if(!survey) {
            res.status(404).json();
                } else {

                    res.status(202).json()
                }
    })
;
router.route('/ShowChart')
    .get(async (req, res) => {
        const surveys = await surveyController.getAll();
            if (!surveys) {
                res.status(404).json();
            }
            res.status(200).json(surveys);
    })

    // Je crée un "show" pour le nouveau complexe fonction pour les données NPS
router.route('/ShowChartData')    
    .get(async (req, res) => {
        const surveys = await surveyController.getAll();
            if (!surveys) {
                res.status(404).json();
            }
            res.status(200).json(surveys);
    })
        
        
    module.exports = router;