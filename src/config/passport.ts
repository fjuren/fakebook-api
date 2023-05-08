require('dotenv').config();
import UsersModelling from '../models/users.model';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// JWT STRATEGY
export const jwtPassport = (passport: any) => {
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      UsersModelling.findOne(
        { id: jwt_payload.sub },
        function (err: any, user: any) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      );
    })
  );
};
