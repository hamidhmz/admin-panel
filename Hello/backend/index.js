const express = require("express");
const mongoose = require("mongoose");
const { logger } = require("./startup/logging");
const startupRoutes = require("./startup/routes");
const startupDb = require("./startup/db");
const startupConfig = require("./startup/config");
const startupValidation = require("./startup/validation");
const startupProd = require("./startup/prod");
const startupSocket = require("./startup/socket");
const cookieParser = require("cookie-parser");
const config = require("config");

const app = express();
app.enable("trust proxy");
app.set("trust proxy", true);
app.set("view engine", "ejs");
app.set("views", "../frontend");
app.use("/hello",express.static(__dirname + "/../frontend/"));
app.use(cookieParser());
app.set("trust proxy");
// app.use(express.json());

startupRoutes(app);
startupDb(mongoose);
startupConfig();
startupValidation();
startupProd(app);
const server = startupSocket(app);


// const port = process.env.PORT || 3000;
app.get('/2222', (req, res) => {
  res.status(200);
});
const server1 = server.listen(config.get("PORT"), () =>
  logger.info(`Listening on port ${config.get("PORT")}...`)
);
module.exports = server1;