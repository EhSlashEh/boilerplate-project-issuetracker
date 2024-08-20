const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

const db = mongooose.connect(uri);

module.exports = db;
