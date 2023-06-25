const express = require('express');
const mongoose = require('mongoose');

const PanelItem = mongoose.model('PanelItem');

const router = express.Router();

router.get('/panelitems', async (req, res) => {
  const panelitems = await PanelItem.find();
  res.send(panelitems);
});

router.get('/panelitem/', async (req, res) => {
  const panelitem = await PanelItem.findOne({
    value: req.query.value,
  }).collation({ locale: 'en', strength: 1 });
  res.send(panelitem);
});

router.post('/panelitem/', async (req, res) => {
  try {
    const panelitem = await PanelItem.create({ ...req.body });
    await panelitem.save();
    res.send(panelitem);
  } catch (e) {
    res.status(200).send(`error creating panelitem_ ${e}`);
  }
});

router.put('/panelitem/', async (req, res) => {
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
