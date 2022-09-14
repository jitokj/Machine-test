//Package Imports
const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const auth = require("../../auth");

// Custom Module/File Imports
const detailHandler = require("./detailHandler");
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

// update api
router.patch(
  "/:userid",
  auth.verifyToken(),
  // restricted to admin with access level -> super
  auth.restrictTo("super"),
  catchError(detailHandler.updatedetail)
);

// delete api
router.delete(
    "/:userid",
    auth.verifyToken(),
     // restricted to admin with access level -> super
    auth.restrictTo("super"),
    catchError(detailHandler.deletedetail)
  );
 
  // get details of the user
  router.get(
    "/:userid",
    auth.verifyToken(),
     // restricted to admin with access level -> super
    auth.restrictTo("super"),
    catchError(detailHandler.getdetail)
  );

  // get all details
  router.get("/",catchError(detailHandler.getAll))
  
  
module.exports = router;
