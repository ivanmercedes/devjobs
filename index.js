
require("dotenv").config();
require("./config/db");

const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
// const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("./config/passport");

const app = express();

// Enable bodyParser
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// Enable handlebars as view
app.engine(
  "hbs",
  hbs({
    defaultLayout: "layouts",
    extname: ".hbs",
    helpers: require("./helpers/hbs"),
  }),
);
app.set("view engine", "hbs");

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("tiny"));

// Alert and Flash messages
app.use(flash());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_MONGO,
    }),
  }),
);
// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

// Create middleware
app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});

// Habilitar  bodyParser para leer datos del formulario
// body parse fue deprecado
app.use(express.urlencoded({ extended: true }));


app.use("/", router());

app.listen(process.env.PORT || 3000);
