
const express = require('express');
// Importation du contrôleur des users
const userController = require('../controllers/user.controller');
// Création d'un nouvel objet de routeur avec Express
const router = express.Router();

router.route('/')
.get(async (req, res) => {
  try {
  // Appel de la méthode getAll dans le contrôleur d'utilisateur
  const users = await userController.getAll();
  // Si aucun utilisateur n'est trouvé, renvoyer une erreur 404 Not Found
  if (!users) {
  res.status(404).json();
  } else {
  // Sinon, renvoyer une réponse 200 OK avec les données d'utilisateur
  res.status(200).json(users);
  }
  } catch (err) {
  // Si une erreur se produit, enregistrer l'erreur et renvoyer une réponse 500 Internal Server Error
  console.error(err);
  res.status(500).json({ message: 'An error occurred while processing the request' });
  }
  })
  .post(async (req, res) => {
    try {
      // Ajouter un user dans la base de données 
      const new_user = await userController.add(req.body);
      // Si l'utilisateur n'a pas été ajouté, return un erreur 404 Not Found
      if (!new_user) {
        res.status(404).json();
      } else {
        // Sinon, return un 201 "Created" avec les infos du nouvel utilisateur
        res.status(201).json(new_user);
      }
    } catch (err) {
      // Si erreur, log le et return un 500 Internal Server Error
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing the request' });
    }
  });

router.route('/:id')
    .get(async (req, res) => {
      // Cherche un utilisateur par son ID
      const user = await userController.getById(req.params.id);
      // Si user pas trouvé, return un 404 Not Found 
      if (!user) {
        res.status(404).json();
        console.log("User not found");
      } else {
        // Sinon return un 200 OK avec les données utlisateur
        res.status(200).json(user);
      }
    })
    .patch(async (req, res) => {
    try {
      // Mise à jour d'un user par ID
      const user = await userController.update(req.params.id, req.body);
      // Si pas d'utilisateur trouvé, return un 404 Not Found
      if (!user) {
        res.status(404).json();
      }
      // Sinon return un 200 OK response avec les infos mises a jour
      res.status(200).json(user);
    } catch (err) {
      // Si erreur, log le et return un 500 Internal Server Error
      console.error
    .delete(async (req, res) => {
    try {
          // Supprimer un single user par ID
            const user = await userController.remove(req.params.id);
      // Si pas d'utilisateur trouvé, return un 404 Not Found
      if (!user) {
            res.status(404).json();
            }
          // Sinon, return un 204 No Content 
            res.status(204).json();
            } catch (err) {
      // Si erreur, log le et return un 500 Internal Server Error
      console.error(err);
                res.status(500).json({ message: 'An error occurred while processing the request' });
            }
        })
    }
  })
;
    module.exports = router;