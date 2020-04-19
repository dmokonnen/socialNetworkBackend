require("express-async-errors"); // for handling async errors()
const config = require("config");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const login = require("./routes/login");

const adminsRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
// const postsRouter = require("./routes/posts");

const app = express();

//remove warning message
mongoose.set("useCreateIndex", true);

//access jwt toekn from env
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}git 

//connect to db
//MongoDbConnectionString="mongodb+srv://damee:D6Zcd2rcyG4wiRZP@dagu-xyemm.mongodb.net/test?retryWrites=true&w=majority"
mongoose
  .connect("mongodb+srv://damee:D6Zcd2rcyG4wiRZP@dagu-xyemm.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Credentials', true);

  res.setHeader(
    "Access-Control-Allow-Headers",

    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization, token, skip" );  // allow our token name as well here
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next(); 
});

app.use("/login", login);
app.use("/admin", adminsRouter);
app.use("/users", usersRouter);
// app.use("/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (err && err.code === 11000) {
    // duplicate error for saving/updating
    res.json(err);
  }

  res.render("error");
});

module.exports = app;
