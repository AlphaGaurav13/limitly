const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


const jwt = require("jsonwebtoken");

const User = require("../models/user");


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback"
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });


                if(!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id
                    });
                }

                return done(null, user);
            }catch(err) {
                return done(err, null);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
})


module.exports = passport;