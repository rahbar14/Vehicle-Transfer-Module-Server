const fs = require("fs");
const express = require("express");

const router = express.Router();

const files = fs.readdirSync(__dirname);

for (let folder of files) {
  if (folder !== "index.js") {
    const route = require(`./${folder}/routes.js`);
    router.use( "/" + folder, route);
  }
}

module.exports = router;