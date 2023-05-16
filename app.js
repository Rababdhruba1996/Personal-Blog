//jshint esversion:6

//requiring the modules :
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hi there!I am very excited to share that I have completed the Blog website with a database. This is my first completed project with a database. I am planning to improve this website while learning about new technologies. Also, I hope to update this blog website regularly as a progress report as a new web developer. Thank you everyone for your support and motivation!";
const aboutContent = "Hi, this is Rabab. I am currently living in Kagoshima, Japan. I am from Bangladesh. I am working as a system engineer here in Japan. My hobbies are listening to music and watching anime and series. I love to walk outside and enjoy the nature. Also recently I started enjoying riding my moped bike.";
const contactContent = "You can contact me vai my email.  Email Address: rababshayradhruba@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
}

//Creating an empty array but we are not using it in this version of the app.
// const posts = [];

//Creating Schema for the posts
const postSchema = {
  title: String,
  content: String
};

//Creating a mongoose model based on this Schema :
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  // Find all items in the Posts collection and render it into our home page.
  Post.find({}).then(function(posts) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

//Saved the title and the post into our blogDB database.
app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  //We are saving the post through our compose route and redirecting back into the home route.
  //A message will be displayed in our console when a post is being saved.
  post.save().then(() => {
      console.log('Post added to DB.');
      res.redirect('/');
    })
    .catch(err => {
      res.status(400).send("Unable to save post to database.");
    });
});

app.get("/posts/:postId", function(req, res) {
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;
  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.
  Post.findOne({
      _id: requestedPostId
    })
    .then(function(post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(function(err) {
      console.log(err);
    })
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
