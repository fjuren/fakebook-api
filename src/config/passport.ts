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
import { Strategy as FacebookStrategy } from 'passport-facebook';
import Users from '../models/users.model';
import { IUsers } from '../models/users.model';

interface FacebookOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  // profileFields: string[];
}

const facebookOptions: FacebookOptions = {
  clientID: process.env.FACEBOOK_CLIENTID as string,
  clientSecret: process.env.FACEBOOK_SECRET as string,
  callbackURL: 'http://localhost:5173/timeline',
  // profileFields: ['id', 'emails', 'name'],
};

export const facebookPassport = (passport: any) => {
  passport.use(
    new FacebookStrategy(facebookOptions, function (
      accessToken,
      refreshToken,
      profile,
      cb
    ) {
      UsersModelling.findOne({
        provider: 'https://www.facebook.com',
        subject: profile.id,
      }),
        // db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
        //   'https://www.facebook.com',
        //   profile.id
        // ],
        function (err: any, cred: any) {
          if (err) {
            return cb(err);
          }
          if (!cred) {
            console.log(profile);
            // The Facebook account has not logged in to this app before.  Create a
            // new user record and link it to the Facebook account.
            // const user: IUsers = new Users({
            //   firstName: profile.displayName,
            //   lastName,
            //   email,
            //   password: bcrypt.hashSync(password, saltRounds),
            //   friendRequest: [],
            //   userRequests: [],
            //   posts: [],
            //   comments: [],
            //   avatar,
            //   accountCreated: new Date(),
            // });
            // db.run(
            //   'INSERT INTO users (name) VALUES (?)',
            //   [profile.displayName],
            //   function (err) {
            //     if (err) {
            //       return cb(err);
            //     }

            //     var id = this.lastID;
            //     db.run(
            //       'INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
            //       [id, 'https://www.facebook.com', profile.id],
            //       function (err) {
            //         if (err) {
            //           return cb(err);
            //         }
            //         var user = {
            //           id: id.toString(),
            //           name: profile.displayName,
            //         };
            //         return cb(null, user);
            //       }
            //     );
            //   }
            // );
          } else {
            // The Facebook account has previously logged in to the app.  Get the
            // user record linked to the Facebook account and log the user in.
            // db.get(
            //   'SELECT * FROM users WHERE id = ?',
            //   [cred.user_id],
            //   function (err, user) {
            //     if (err) {
            //       return cb(err);
            //     }
            //     if (!user) {
            //       return cb(null, false);
            //     }
            //     return cb(null, user);
            //   }
            // );
          }
        };
    })
  );
};
