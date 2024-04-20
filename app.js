const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const router = require("./routes");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: "6623c2dd10c61832ba3902d9", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
