var GoogleStrategy =    require('passport-google-oauth20').Strategy;
const router =          require('express').Router();
const passport =        require("passport");
const mongoose =        require('mongoose');
const User =            require('../models/users');
const jwt =             require('jsonwebtoken');

const config = require('../config/database');

const callback_url = process.env.ENDPOINT_URL || "http://localhost:3001";

passport.use(new GoogleStrategy({
  clientID: '1002827805875-nuc8chhmq7u5etofvfuvhqonpmclbdfb.apps.googleusercontent.com',
  clientSecret: 'Gpw0ZSVkjI33ZRVQXNupvcM9',
  callbackURL: callback_url + "/auth/google/callback"
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    let { displayName, emails, photos, token } = req.user;
    let { id } = req.user._json;

    try {
        let query = await User.findOne({ google_id: id }).exec();
        if (query === null) {
            var newUser = new User({
                name: displayName,
                email: emails[0].value,
                profilePic: photos[0].value,
                google_id: id,
                address: '',
                phoneNumber: ''
            });

            newUser.save();
        }

        return res.redirect(`http://localhost:3000?id=${id}&new=${query === null ? 'true' : 'false'}`);
    }
    catch (err) {
      console.log(err);
      return res.status(422).json({
        success: false,
        msg: 'Error during Google authentication process'
      });
    }
  });

router.post('/auth/find-by-google-id', async (req,res) => {
  let { google_id } = req.body;

  try {
    let user = await User.findOne({ google_id }).exec();
    
    if (user !== null) {
      const token = jwt.sign({data: {
          google_id,
      }}, config.secret, {
          expiresIn: 604800 // 1 week
      });

      return res.status(200).json({
        message: 'Found user with that Google ID',
        success: true,
        user,
        token
      });
    } else {
      throw new Error('Could not find user');
    }
  }
  catch(err) {
    return res.status(422).json({
      success: false,
      msg: 'Unable to find any users with that Google ID'
    });
  }
});

module.exports = router;
