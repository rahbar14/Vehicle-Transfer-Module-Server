const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();
const {testConnection} = require("./src/connection/db");
const routes = require("./src/routes");
const Logger = require("./src/utils/logger");

testConnection();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("./public"))
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    req.logger = new Logger(req);
    next();
})

app.use("/api", routes)


app.listen(port, () => {
    console.log(`Server Listening On Port: ${port}`)
})