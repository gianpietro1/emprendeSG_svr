const express = require('express');
const mongoose = require('mongoose');

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

router.put('/business/', async (req, res) => {
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
