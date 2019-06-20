const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");

require("./config/passport-setup");
const authRouter = require("./api/authRouter");
const checkLoginRouter = require("./api/checkLoginRouter");
const filesRouter = require("./api/filesRouter");
const keys = require("./config/keys");

const app = express();

app.use(cors());

// app.use("*/uploads", express.static("uploads"));
app.use(
  "/uploads",
  // passport.authenticate("jwt", { session: false }),
  filesRouter
);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("Connected to database");
});
mongoose.set("useCreateIndex", true);

app.use(
  "/graphql",
  passport.authenticate("jwt", { session: false }),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);
app.use("/auth", authRouter);
app.use(
  "/checkLogin",
  passport.authenticate("jwt", { session: false }),
  checkLoginRouter
);

app.listen(4000, () => console.log("Now listening for requests on port 4000"));
