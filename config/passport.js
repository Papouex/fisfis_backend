const JwtStrategy = require('passport-jwt').Strategy ;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users');
const Admin = require('../models/admin');
const config = require('./db-conf');

module.exports = function(passport){
    let opts = {} ;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secret ;
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        User.getUserById(jwt_payload._id, (err, user) => {
                if(err){
                    return done(err, false);
                }
                if(user){
                    return done(null,user);
                }
                else{
                    Admin.getAdminById(jwt_payload._id, (err, admin) => {
                        if(err){
                            return done(err, false);
                        }
                        if(admin){
                            return done(null,admin);
                        }else{
                            return done(null,false);
                        }
                        
                  }) ;
                }
        }) ;

    }));
}