const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/techMunchDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = new mongoose.model("Article", articleSchema)

app.get("/", (req, res) => {
  Article.find({}, (err, foundArticles) => {
    if (err) { console.log(err) }
    res.send(foundArticles)
  })
})

app.listen(3000, function () {
  console.log("Server started: port 3000");
});
