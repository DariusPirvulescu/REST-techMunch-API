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
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("status 200 000 000, article added, so awesome!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("You've just deleted all the articles");
      } else {
        res.send(err);
      }
    });
  });

/// Route for a Specific article
app.route("/:title").get((req, res) => {
  const articleTitle = req.params.title;

  Article.find({ title: articleTitle }, (err, foundArticle) => {
    if (err) {
      res.send(err);
    }
    res.send(foundArticle);
  });
});

app.listen(3000, () => {
  console.log("Server started: port 3000");
});
