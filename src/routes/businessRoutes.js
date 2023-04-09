const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { uuid } = require('uuidv4');
const DIR = './public/images/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    cb(null, uuid() + '-' + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

const Business = mongoose.model('Business');

const router = express.Router();

router.get('/businesses', async (req, res) => {
  const businesss = await Business.find();
  res.send(businesss);
});

router.get('/business/', async (req, res) => {
  const business = await Business.findOne({
    name: req.query.name,
  }).collation({ locale: 'en', strength: 1 });
  res.send(business);
});

router.post('/business/', async (req, res) => {
  try {
    const business = await Business.create({ ...req.body });
    await business.save();
    res.send(business);
  } catch (e) {
    res.status(200).send(`error creating business_ ${e}`);
  }
});

router.put('/business/', upload.single('image'), async (req, res, next) => {
  var update = {
    ...req.body,
    upcomingEvent: JSON.parse(req.body.upcomingEvent),
    socialNetworks: JSON.parse(req.body.socialNetworks),
  };
  const url = 'https://' + req.get('host');
  // const url = 'http://' + req.get('host');
  let business = await Business.findOne({
    name: { $regex: req.query.name, $options: 'i' },
  });
  if (req.file) {
    await business.updateOne({
      ...update,
      image: url + '/images/' + req.file.filename,
    });
  } else {
    await business.updateOne(update);
  }
  await business
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Business photo updated successfully!',
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

module.exports = router;