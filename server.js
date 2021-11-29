// Dependencies
// ==========================================================
const path = require('path');
const express = require('express');
const routes = require('./controllers')
const sequelize = require('./config/connection')

// Helpers
const helpers = require('./utils/helpers');
const sessions = require('express-session')

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

// Sets up the Express App
// ==========================================================
const app = express();
const PORT = process.env.PORT || 3001;

// Session Stores
const SequelizeStore = require('connect-session-sequelize')(sessions.Store);

const sess = {
    secret: 'nagato',
    cookie: {
        expires: 10 * 60 * 1000
    },
    resave: true,
    rollings: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
};

app.use(sessions(sess));

// Sets Handlebars as the default template engine 
// ==========================================================
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Controllers
app.use(routes);

// Starts the server to begin listening 
// ==========================================================
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });