const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb://admin:admin123456@ds263856.mlab.com:63856/futballin",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("Connected to database");
});
mongoose.set("useCreateIndex", true);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(5000, () => console.log("Now listening for requests on port 5000"));
