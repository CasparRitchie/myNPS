// Import d'express pour créer des routes
const express = require('express');

// Import de jsonwebtoken librarie pour créer des JWTs
const jwt = require('jsonwebtoken');

// Import user controller pour appels vers user db
const userController = require('../controllers/user.controller');

// Import user schema pour valider user input
const userSchema = require('../models/user');

// Import signup schema pour valider signup input
const signSchema = require('../models/sign');

// Import de validator utility pour valider input data
const validator = require('../utils/validator');

// Import de config de l'application
const config = require('../config');

// Import de login validator utility pour verifier login credentials
const loginValidator = require('../utils/auth');

// Creation d'un nouveau router pour "/auth" 
const router = express.Router();

// Definir POST route pour /auth 
router.route('/')
  // Valider le body du request contre schema utilisateur
  .post(validator(userSchema), async (req, res) => {
    // verifier l'existence d'un user dans le database avec cet email et password
    let user = await userController.getByEmailAndPassword(req.body);

    // si pas d'user trouvé, return un 401 Unauthorized error
    if (!user) {
      res.status(401).json({message: "Hmm that doesn't seem to be the right username & password combination"});
    } else {
      // si user trouvé, creation d'un JWT contenant  email, roles, et ID du user
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        roles: user.roles
      }, config.jwtPass, {expiresIn: config.jwtExpireLength});

      // Return du JWT au client
      res.json({
        access_token: token
      });
    }
  });

// Definir un POST route pour /auth/signup
router.route('/signup')
  // Validate the request body against the signup schema
  .post(validator(signSchema), async (req, res) => {
    // Check if there is already a user in the database with the given email
    const user = await userController.getByEmail(req.body);

    // If a user was found, return a 400 Bad Request error
    if (user) {
      res.status(400).json({message: "This email is already in use"});
    } else {
      // If no user was found, add a new user to the database
      const new_user = await userController.add(req.body);
      
      // Create a JWT for the new user
      const token = jwt.sign({
        id: new_user.id,
        email: new_user.email,
        roles: new_user.roles
      }, config.jwtPass, { expiresIn: config.jwtExpireLength });

      // Return the JWT to the client
      res.json({
        access_token: token
      });
    }
  });

// Export

module.exports = router;