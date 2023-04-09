const express = require('express');
const mongoose = require('mongoose');

const Category = mongoose.model('Category');

const router = express.Router();

router.get('/categories', async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.get('/category/', async (req, res) => {
  const category = await Category.findOne({
    value: req.query.value,
  }).collation({ locale: 'en', strength: 1 });
  res.send(category);
});

router.post('/category/', async (req, res) => {
  try {
    const category = await Category.create({ ...req.body });
    await category.save();
    res.send(category);
  } catch (e) {
    res.status(200).send(`error creating category_ ${e}`);
  }
});

router.put('/category/', async (req, res) => {
  var update = req.body;
  let category = await Category.findOne({
    value: { $regex: req.query.value, $options: 'i' },
  });

  await category.updateOne(update);
  await category
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Category updated successfully!',
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
