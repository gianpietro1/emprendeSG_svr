const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const auth = require('../middleware/auth');

const User = mongoose.model('User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).send('Se requiere ingresar todos los campos');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res
        .status(409)
        .send(
          'El nombre de usuario ya existe, por favor cámbialo o ingresa con el existente.',
        );
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, keys.TOKEN_KEY, {
      // expiresIn: '16h',
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here});
});

// Login
router.post('/login', async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!((email || username) && password)) {
      res.status(400).send('Se requiere ingresar todos los campos');
    }
    // Validate if user exist in our database
    if (email && email.includes('@')) {
      var user = await User.findOne({ email });
    }

    if (username && !username.includes('@')) {
      var user = await User.findOne({ username });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, keys.TOKEN_KEY, {
        // expiresIn: '16h',
      });

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send('Credenciales inválidas');
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.get('/checkToken', auth, async (req, res) => {
  const userId = req.user.user_id;
  const user = await User.findById(userId);
  res.send(user);
});

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get('/user/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.send(user);
});

router.put('/user/:username', auth, async (req, res) => {
  const user = await User.findOne({
    username: req.params.username,
  });
  if (req.body.password) {
    var update = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    };
  } else {
    var update = req.body;
  }
  await user.updateOne(update);
  await user.save();
  res.send(user);
});

module.exports = router;
