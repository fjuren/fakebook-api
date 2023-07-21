require('dotenv').config();
import UsersModelling from '../models/users.model';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// JWT STRATEGY
export const jwtPassport = (passport: any) => {
  passport.use(
    new JwtStrategy(JwtOptions, function (jwt_payload, done) {
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

// // Facebook STRATEGY
import FacebookStrategyToken from 'passport-facebook-token';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';

interface FacebookOptions {
  clientID: string;
  clientSecret: string;
}

const facebookOptions: FacebookOptions = {
  clientID: process.env.FACEBOOK_CLIENTID as string,
  clientSecret: process.env.FACEBOOK_SECRET as string,
};

export const facebookPassport = (passport: any) => {
  passport.use(
    new FacebookStrategyToken(
      facebookOptions,
      async (accessToken, refreshToken, profile, done) => {
        console.log('test');
        try {
          console.log(profile);
          let user = await Users.findOne({
            // provider: 'https://www.facebook.com',
            facebookID: profile.id,
          });
          // The Facebook account has not logged in to this app before.  Create a
          // new user record and link it to the Facebook account.
          if (!user) {
            user = new Users({
              firstName: profile.displayName.split(' ')[0],
              lastName: profile.displayName.split(' ')[1],
              email: profile.emails[0].value,
              facebookId: profile.id,
              password: 'facebookAccount',
              friendRequest: [],
              userRequests: [],
              posts: [],
              comments: [],
              avatar: profile.photos,
              accountCreated: new Date(),
            });
            // await user.save();
            console.log(user);
          }
          done(null, user);
        } catch (err) {
          done(err, false);
        }
        // db.run(
        //   'INSERT INTO users (name) VALUES (?)',
        //   [profile.displayName],
        //   function (err) {
        //     if (err) {
        //       return done(err);
        //     }
        //     var id = this.lastID;
        //     db.run(
        //       'INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
        //       [id, 'https://www.facebook.com', profile.id],
        //       function (err) {
        //         if (err) {
        //           return done(err);
        //         }
        //         var user = {
        //           id: id.toString(),
        //           name: profile.displayName,
        //         };
        //         return done(null, user);
        //       }
        //     );
        //   }
        // );
        // } else {
        // The Facebook account has previously logged in to the app.  Get the
        // user record linked to the Facebook account and log the user in.
        // db.get(
        //   'SELECT * FROM users WHERE id = ?',
        //   [cred.user_id],
        //   function (err, user) {
        //     if (err) {
        //       return done(err);
        //     }
        //     if (!user) {
        //       return done(null, false);
        //     }
        //     return done(null, user);
        //   }
        // );
        // }
      }
    )
  );
};
