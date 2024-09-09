const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require("helmet");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { limiter } = require("./middlewares/limiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { MONGO_URI, PORT = 3000 } = process.env;

// Log MONGO_URI to ensure it's defined
console.log("MONGO_URI:", MONGO_URI);

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is undefined. Please check your environment variables."
  );
  process.exit(1); // Stop the app if MONGO_URI is not defined
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.error("DB Connection Error:", err));

const app = express();

app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter); // Ensure limiter is a valid middleware
app.use("/", mainRouter); // Ensure mainRouter is a valid router
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
