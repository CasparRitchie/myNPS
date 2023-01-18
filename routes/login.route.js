// Import d'express pour créer des routes
const express = require('express');

// Import de jsonwebtoken librarie pour créer des JWTs
const jwt = require('jsonwebtoken');

// Import user controller pour appels vers user db
const userController = require('../controllers/user.controller');

// Import user schema pour valider user input
const userSchema = require('../models/user');

// Import de validator utility pour valider input data
const validator = require('../utils/validator');

// Import de config de l'application
const config = require('../config');

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

      // si user trouvé, creation d'un JWT contenant  email, role, et ID du user
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      }, config.jwtPass, {expiresIn: config.jwtExpireLength});

      // Return du JWT au client
      res.status(200).json({
        access_token: token,
        // role: user.role,
      });
    }
  });
module.exports = router;