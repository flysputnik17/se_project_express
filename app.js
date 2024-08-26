const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { limiter } = require("./middlewares/limiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });
const { PORT = 3000 } = process.env;
const app = express();

const corsOptions = {
  origin: ["https://wtwr-three.vercel.app/"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
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
