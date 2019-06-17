const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const keys = require("./keys");
const User = require("../model/user");

passport.serializeUser((user, done) => {
  // next stage is stuff it to a cookie
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    // comes from the cookie, to next stage
    done(null, user);
  });
});

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: keys.session.cookieKey
    },
    function(jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      // options
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log("passport callback fired");
      // console.log(profile);
      // Check if user already exists
      User.findOne({ googleId: profile.id }).then(user => {
        if (user) {
          //already have the user, change whatever change there might be on google
          User.findOneAndUpdate(
            { googleId: profile.id },
            {
              email: profile.emails[0].value,
              name: profile.displayName,
              photoURL: profile.photos[0].value
            }
          ).then(currentUser => {
            console.log("user is: ", currentUser);
            // goes to passport.serializaUser middleware
            // first null argument is the error (if any)
            done(null, currentUser);
          });
        } else {
          new User({
            googleId: profile.id,
            name: profile.displayName,
            username: profile.displayName,
            email: profile.emails[0].value,
            photoURL: profile.photos[0].value,
            avatar: profile.photos[0].value
          })
            .save()
            .then(newUser => {
              console.log("new user created: ", newUser);
              // goes to passport.serializaUser middleware
              // first null argument is the error (if any)
              done(null, newUser);
            })
            .catch(err => {
              // goes to passport.serializaUser middleware
              // first err argument is the error (if any)
              done(err, null);
            });
        }
      });
    }
  )
);
