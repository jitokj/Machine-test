//Package Imports
const express = require("express");
const cors = require("cors");
var useragent = require("express-useragent");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const auth = require("../../auth");

// Custom Module/File Imports
const fileUploadHandler = require("./upload");
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

router.post(
  "/upload",
  auth.verifyToken(),
  auth.restrictTo("super"),
  catchError(fileUploadHandler.fileUpload)
);

module.exports = router;
