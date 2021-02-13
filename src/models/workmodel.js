const mongoose = require("mongoose");

const ResourceItem = new mongoose.Schema({
  _id: false,
  idResource: [String],
  from: Date,
  to: Date,
  treatment: String
});

const Schema = new mongoose.Schema({
  idClient: String,
  day: Date,
  resources: [ResourceItem]
});

module.exports = mongoose.model("Work", Schema);
