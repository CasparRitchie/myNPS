const express = require('express');
// j'importe mes routes ici

const userRoute = require('./user.route');
const surveyRoute = require('./survey.route');
const loginRoute = require('./login.route');

// j'appelle le router de Express comme j'ai fait sur app.js
const router = express.Router();

// et puis je vise le route pour chaque entité que je crée
// les routes dans le fichier survey.route.js pointeront vers
// "http;//localhost/api/surveys"
router.use('/users', userRoute);
router.use('/surveys', surveyRoute);
router.use('/surveys/ShowChart', surveyRoute);
router.use('/surveys/ShowChartData', surveyRoute);
router.use('/login', loginRoute);


// j'exporte le router pour le rendre accessible avec un require
// dans app.js si on fait "const router : require('./routes')",
// router prend la valeur de ce qui est renseigné dans ce module.exports

module.exports = router;