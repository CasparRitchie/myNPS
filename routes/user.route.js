const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      // Call the getAll method in the user controller
      const users = await userController.getAll();
      // If no users are found, return a 404 Not Found error
      if (!users) {
        res.status(404).json();
      } else {
        // Otherwise, return a 200 OK response with the users data
        res.status(200).json(users);
      }
    } catch (err) {
      // If an error occurs, log the error and return a 500 Internal Server Error response
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing the request' });
    }
  })
  .post(async (req, res) => {
    try {
      // Add a new user to the database
      const new_user = await userController.add(req.body);
      // If no user was added, return a 404 Not Found error
      if (!new_user) {
        res.status(404).json();
      } else {
        // Otherwise, return a 201 Created response with the new user data
        res.status(201).json(new_user);
      }
    } catch (err) {
      // If an error occurs, log the error and return a 500 Internal Server Error response
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing the request' });
    }
  });

router.route('/:id')
    .get(async (req, res) => {
    try {
      // Get a single user by ID
      const user = await userController.getById(req.params.id);
      // If no user is found, return a 404 Not Found error
      if (!user) {
        res.status(404).json();
        console.log("User not found");
      } else {
        // Otherwise, return a 200 OK response with the user data
        res.status(200).json(user);
      }
    } catch (err) {
      // If an error occurs, log the error and return a 500 Internal Server Error response
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing the request' });
    }
    })
    .patch(async (req, res) => {
    try {
      // Update a single user by ID
      const user = await userController.update(req.params.id, req.body);
      // If no user is found, return a 404 Not Found error
      if (!user) {
        res.status(404).json();
      }
      // Otherwise, return a 200 OK response with the updated user data
      res.status(200).json(user);
    } catch (err) {
      // If an error occurs, log the error and return a 500 Internal Server Error response
      console.error
    .delete(async (req, res) => {
    try {
          // Delete a single user by ID
            const user = await userController.remove(req.params.id);
          // If no user is found, return a 404 Not Found error
            if (!user) {
            res.status(404).json();
            }
          // Otherwise, return a 204 No Content response
            res.status(204).json();
            } catch (err) {
            // If an error occurs, log the error and return a 500 Internal Server Error response
                console.error(err);
                res.status(500).json({ message: 'An error occurred while processing the request' });
            }
        })
    }
  })
;
    module.exports = router;