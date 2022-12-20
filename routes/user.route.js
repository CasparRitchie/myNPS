const express = require('express');
// J'appelle un fichier nommé "user.controller"
// il sert à séparer la logique - route liste les méthodes HTTP 
// à disposition et "controller" contient la logique des données
// c'est à dire dans ce cas, les appels mysql

const userController = require('../controllers/user.controller');

const router = express.Router();

// Je liste mes methodes HTTP pour chaque route:
// GET et PUT sur / ...( c'est a dire "http://localhost/api/users")

router.route('/')
    .get(async (req, res) => {
        //jappelle le fonction que jai crée dans le controller
        const users = await userController.getAll();
        // si je ne recois rien, je repond un 404.
        if (!users) {
            res.status(404).json();
        } else {

            // sinon je renvoi 200 avec les données (users)
            res.status(200).json(users);
        }
    })
    .post(async (req, res) => {
        const new_user = await userController.add(req.body);

        if (!new_user) {
            res.status(404).json();
        } else {

            res.status(201).json(new_user);
        }
    })
;
// je crée une partie avec les routes /id pour visualiser 1 seule réponse, au lieu d'une liste de réponses

router.route('/:id')
    .get(async (req, res) => {
        const user = await userController.getById(req.params.id);
        if (!user) {
            res.status(404).json();
            console.log("User not found");
        } else {
            res.status(200).json(user);
        }
    })
    .patch(async (req, res) => {
        const user = await userController.update(req.params.id, req.body);
        if (!user) {
            res.status(404).json();
        }
            res.status(202).json(user);
    })
    .delete(async (req, res) => {
        const user = await userController.remove(req.params.id);
        if (!user) {
            res.status(404).json();
        }
            res.status(202).json();
    })
;
module.exports = router;