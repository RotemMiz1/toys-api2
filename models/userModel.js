const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    default: "USER"
  }
}, { timestamps: true });

exports.UserModel = mongoose.model("users", schema);

exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required()
  });

  return joiSchema.validate(_reqBody);
};