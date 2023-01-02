/**
 * Required External Modules
 */

const express = require('express');
const path = require('path');
const https = require('https')
const fs = require("fs");
const jwt = require('jsonwebtoken');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const { store } = require('./redisClient');

require('dotenv').config();

const authRouter = require('./auth');
/**
 * App Variables
 */
 const options = {
  key: fs.readFileSync("./config/myapp.example-key.pem"),
  cert: fs.readFileSync("./config/myapp.example.pem"),
};
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const domain = process.env.DOMAIN || 'localhost';
const port = process.env.PORT || '3000';

/**
 * Session Configuration (New!)
 */

const session = {
  secret: process.env.SESSION_SECRET,
  store,
  name: '_xp_session',
  cookie: {
    maxAge: 5 * 86400 * 1000
  },
  resave: false,
  saveUninitialized: true,
};

if (app.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

/**
 * Passport Configuration
 */

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
  },
  function (accessToken, refreshToken, extraParams, auth0Profile, done) {
    const namespace = 'https://example.com/'
    const jsonProfile = auth0Profile['_json']
    // set this rule claims to profile
    const profile = {
      ...auth0Profile,
      age: jsonProfile[namespace+'_age'],
      phone: jsonProfile[namespace+'_phone']
    }

    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);

/**
 * Secure middleware
 */

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/**
 *  App Configuration
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', authRouter);
/**
 * Routes Definitions
 */

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/user', secured, (req, res) => {
  console.log('Session', req.session)
  const { _raw, _json, ...userProfile } = req.user;
  res.render('user', {
    title: 'Profile',
    userProfile,
  });
});

app.get('/mfa', (req, res) => {
  const {state, session_token} = req.query
  let decoded
  try {
    decoded = jwt.verify(session_token, process.env.MY_REDIRECT_SECRET)
  } catch (error) {
    console.log(error)
    return res.redirect('/logout')
  }
  const {phone} = decoded
  res.render('mfa', {
    state,
    phone
  });
});


app.post('/verify', async (req, res) => {
  const{sms_code, state} = req.body
  const redirect_uri = 'https://dev-3u0dqtccqa2u3g3y.us.auth0.com/continue?state='+state+'&sms_code='+sms_code
  res.status(302).redirect(redirect_uri)
})

/**
 * Server Activation
 */

 https.createServer(options, app).listen(port,  () => {
  console.log(`Listening to requests on https://${domain}:${port}`);
});
