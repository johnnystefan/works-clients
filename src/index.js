const express = require("express");
const PORT = process.env.PORT || 3000;
const path = require("path");
const morgan = require("morgan");
const worksApiRouter = require('./routes/api/works')


//INITIALIZE APP WITH EXPRESS
const app = express();
app.use(morgan("dev"));
app.use(express.static("public"));

// API REST
worksApiRouter(app)

// render data forward
app.get("/", (req, res) => {
  const IndexPath = path.join(__dirname, "../public/index.html");
  res.sendFile(IndexPath);
});

const server = app.listen(PORT, function() {
  console.log(`Listening http://localhost:${server.address().port}`);
});
