const express = require('express');
const mongoose = require('mongoose');
const PanelItem = mongoose.model('PanelItem');
const multer = require('multer');
const { uuid } = require('uuidv4');
const DIR = './public/images/';
const auth = require('../middleware/auth');

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

router.get('/panelitems', async (req, res) => {
  const panelitems = await PanelItem.find();
  res.send(panelitems);
});

router.get('/panelitem/', async (req, res) => {
  const panelitem = await PanelItem.findOne({
    _id: req.query.id,
  }).collation({ locale: 'en', strength: 1 });
  res.send(panelitem);
});

router.delete('/panelitem/', async (req, res) => {
  const panelitem = await PanelItem.findOne({
    _id: req.query.id,
  }).collation({ locale: 'en', strength: 1 });
  panelitem.delete();
  res.send(`item ${req.query.id} delete`);
});

router.post(
  '/panelitem/',
  auth,
  upload.single('image'),
  async (req, res, next) => {
    if (req.file) {
      const panelitem = await PanelItem.create({
        ...req.body,
        image: 'https://sg.radioperu.pe/images/' + req.file.filename,
      });
      // const panelitem = await PanelItem.create({
      //   ...req.body,
      //   image: 'http://localhost:3002/images/' + req.file.filename,
      // });
      await panelitem.save();
      res.send(panelitem);
    } else {
      const panelitem = await PanelItem.create({ ...req.body });
      await panelitem.save();
      res.send(panelitem);
    }
  },
);

router.put('/panelitem/', auth, async (req, res) => {
  var update = req.body;
  let panelitem = await PanelItem.findOne({
    value: { $regex: req.query.value, $options: 'i' },
  });

  await panelitem.updateOne(update);
  await panelitem
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'PanelItem updated successfully!',
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
