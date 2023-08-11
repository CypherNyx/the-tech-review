const express = require("express");
const sequelize = require("./config/connection");

const { User, Post, Comment } = require("./models");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

// Handlebars middleware
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT);
  console.log(`Server listening on port ${PORT}!`);
});
