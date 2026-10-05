const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel, validateUser } = require("../models/userModel");

const router = express.Router();

router.post("/", async(req, res) => {
  const validBody = validateUser(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {

    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ err: "Email already exists" });
    }

  
    const password = await bcrypt.hash(req.body.password, 10);

 
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: password
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.post("/login", async(req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        err: "Email or password is incorrect"
      });
    }

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        err: "Email or password is incorrect"
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    res.json({
      token: token
    });

  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
module.exports = router;