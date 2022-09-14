// Package Imports
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");

//Custom imports
const AppError = require("./core/errorHandler/appError");
const globalErrorHandler = require("./core/errorHandler/errorMiddleware");

const authHandler = require("./routes/authentication");
const fileUploadHandler = require("./routes/fileUpload");
const detailHandler = reqire("./routes/detail");

//Initialize Express
const app = express();
// Middleware for showing path and status code
app.use(morgan("dev"));

//Routes

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'text/csv'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

app.use("/auth", authHandler);
app.use("/file-upload",upload.single("csvfile"),fileUploadHandler);
app.use("/detail",detailHandler);


app.all("*", (req, res, next) => {
  next(new AppError(404, "global", "G_E011", `${req.originalUrl}`, true));
});

app.use(globalErrorHandler);

module.exports = app;
