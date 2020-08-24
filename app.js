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
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("Article", articleSchema);

// Route for all articles
app
  .route("/")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      !err ? res.send(foundArticles) : res.send(err)
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      !err ? res.send("status 200 000 000, article added, so awesome!") : res.send(err);
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      !err ? res.send("You've just deleted all the articles") : res.send(err)
    });
  });

/// Route for a Specific article
app
  .route("/:title")
  .get((req, res) => {
    const articleTitle = req.params.title;

    Article.find({ title: articleTitle }, (err, foundArticle) => {
      !err ? res.send(foundArticle) : res.send(err)
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        !err ? res.send("Success updating article") : res.send("err")
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { $set: req.body },
      (err) => {
        !err ? res.send("Success updating article using Patch req") : res.send(err)
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title }, (err) => {
      !err ? res.send(`Successfully deleted ${req.params.title} article`) : res.send(err)
    });
  });

app.listen(3000, () => {
  console.log("Server started: port 3000");
});
