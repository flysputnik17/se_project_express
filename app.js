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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.error("DB Connection Error:", err));
const { PORT = 3000 } = process.env;
// const { PORT = 3001 } = process.env;
const app = express();

app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
