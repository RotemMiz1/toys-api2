const express = require("express");
const {ToyModel, validateToy} = require("../models/toyModel")
const auth = require("../models/auth");
const router = express.Router();


// Get toys - 10 toys per page
router.get("/", async(req,res) => {
  try{
    const skip = Number(req.query.skip) || 0;

    const data = await ToyModel.find({})
      .skip(skip * 10)
      .limit(10);

    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});


// Get number of toys
router.get("/count", async(req,res) => {
  try{
    const count = await ToyModel.countDocuments({});
    res.json({count});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});


// Search toys by name or info
router.get("/search", async(req,res) => {
  try{
    const skip = Number(req.query.skip) || 0;
    const searchQ = req.query.s || "";
    const searchExp = new RegExp(searchQ, "i");

    const data = await ToyModel.find({
      $or: [
        {name: searchExp},
        {info: searchExp}
      ]
    })
    .skip(skip * 10)
    .limit(10);

    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});


// Get toys by category
router.get("/category/:catname", async(req,res) => {
  try{
    const skip = Number(req.query.skip) || 0;
    const catname = req.params.catname;

    const data = await ToyModel.find({
      category: catname
    })
    .skip(skip * 10)
    .limit(10);

    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});


router.get("/single/:id", async(req,res) => {
  try{
    const id = req.params.id;
    const data = await ToyModel.findOne({_id:id});

    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});
router.post("/", auth, async(req,res) => {
  const validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
  req.body.user_id = req.tokenData._id;

  const toy = new ToyModel(req.body);
  await toy.save();
  res.json(toy);
}
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.put("/:id", auth, async(req,res) => {
  const validBody = validateToy(req.body);

  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }

  try{
    const id = req.params.id;

    const data = await ToyModel.updateOne(
      {
        _id: id,
        user_id: req.tokenData._id
      },
      req.body
    );

    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});


router.delete("/:id", auth, async(req,res) => {
  try{
    const id = req.params.id;

    const data = await ToyModel.deleteOne({
      _id: id,
      user_id: req.tokenData._id
    });

    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
});

module.exports = router;