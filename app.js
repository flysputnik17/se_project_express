const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

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

app.use(express.json());
app.use(cors());
app.use("/", mainRouter);

console.log("test");

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
