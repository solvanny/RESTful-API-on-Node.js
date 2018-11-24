const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { User, validation } = require('../modules/user');


//Get all users
router.get('/', async (req, res) => {
  let users = await User.find().sort('name');
  res.send(users);
});

//Create a new user
router.post('/', async (req, res) => {
  let { error } = validation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(user) res.status(400).send('User allredy registred!');
  
  user = new User(_.pick(req.body, ['name', 'password', 'email']));

  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  let token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

//Update user by ID
router.put('/:id', async (req, res) => {
  let { error } = validation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findByIdAndUpdate(req.params.id, _.pick(req.body, ['name', 'password', 'email']), { new: true });
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

//Delete user by ID
router.delete('/:id', async (req, res) => {
  let user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

//Find user by ID
router.get('/:id', async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

module.exports = router;