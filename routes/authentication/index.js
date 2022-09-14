//Package Imports
const express = require("express");
const cors = require("cors");
var useragent = require("express-useragent");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Custom Module/File Imports
const authHandler = require("./auth");
const catchError = require("../../core/errorHandler/catchError");

// Global Definitions
// const app = express();
const router = express.Router();

// Middelwares
router.use(cors());
router.use(express.json({ limit: "5mb" }));
router.use(useragent.express());
// Data sanitization against NoSQL query injection
router.use(mongoSanitize());
// Data sanitization against XSS
router.use(xss());

router.post("/login", catchError(authHandler.login));
router.post("/logout", catchError(authHandler.logout));

module.exports = router;
