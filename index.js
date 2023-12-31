require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

const cors = require('cors')
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
require("./config/session")(app);

app.use("/static/uploads", express.static("uploads"));
app.use("/static/images", express.static("images"));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  return res.json({
    success: false,
    code: 0,
    error: err,
  });
});
app.use(express.json());
// router 
app.use('/', require('./routes'))

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Listening on port 3001'));
