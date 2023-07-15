const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const Business = mongoose.model('Business');

const multer = require('multer');
const { uuid } = require('uuidv4');
const DIR = './public/images/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
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

router.delete('/business/', async (req, res) => {
  const business = await Business.findOne({
    _id: req.query.id,
  }).collation({ locale: 'en', strength: 1 });
  business.delete();
  res.send(`business ${req.query.id} deleted`);
});

router.post('/business/', auth, upload.any(), async (req, res) => {
  console.log('request', req);
  try {
    if (req.files) {
      // console.log(
      //   'image is',
      //   'https://sg.radioperu.pe/images/' +
      //     req.files.filter((f) => f.fieldname === 'image')[0].filename,
      // );
      // console.log(
      //   'logo is',
      //   'https://sg.radioperu.pe/images/' +
      //     req.files.filter((f) => f.fieldname === 'logo')[0].filename,
      // );
      const business = await Business.create({
        ...req.body,
        flyer:
          'https://sg.radioperu.pe/images/' +
          req.files.filter((f) => f.fieldname === 'image')[0].filename,
        logo:
          'https://sg.radioperu.pe/images/' +
          req.files.filter((f) => f.fieldname === 'logo')[0].filename,
      });
      // const panelitem = await PanelItem.create({
      //   ...req.body,
      //   image: 'http://localhost:3002/images/' + req.file.filename,
      // });
      await business.save();
      res.send(business);
    } else {
      const business = await Business.create({ ...req.body });
      await business.save();
      res.send(business);
    }
  } catch (e) {
    res.status(200).send(`error creating business_ ${e}`);
  }
});

router.put('/business/vote/', async (req, res) => {
  const business = await Business.findOne({
    name: req.query.name,
  }).collation({ locale: 'en', strength: 1 });
  const newVote = req.body.vote;
  const currentVotes = business.voteCount;
  const currentSum = business.voteSum;
  const newVotes = currentVotes + 1;
  const newSum = currentSum + newVote;
  const newAvg = newSum / newVotes;
  business.voteCount = newVotes;
  business.voteSum = newSum;
  business.voteAvg = newAvg;
  business.save();
  res.status(200).send(`new average: ${newAvg}`);
});

router.put('/business/', auth, async (req, res) => {
  var update = req.body;
  let business = await Business.findOne({
    name: { $regex: req.query.name, $options: 'i' },
  });

  await business.updateOne(update);
  await business
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Business updated successfully!',
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
