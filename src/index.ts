// import app from "./server"

// app.listen(3000, () => {
//   console.log(`Example app listening on port 3000`)
// })

// openssl rand -hex 32  // to generate a secrete key like below
// like bc5594d990cdd01a10860174753b74263acdb5a7c78f2bf2a253bdae1d020ec8
import 'reflect-metadata';
// The import 'reflect-metadata'; statement acts as a polyfill that extends JavaScript's global Reflect object with the metadata reflection API.
import { Action, useExpressServer } from 'routing-controllers';
import { UserController } from './UserController';
import { TodoController } from './TodoController';
import { DataSource } from "typeorm"
import { Posts } from './entity/posts.entity';
import { PostController } from './PostsController';
import AppDataSource from "./AppSource"
let express = require('express');
let app = express();
var morgan = require('morgan')
import passport from 'passport';
import { jwtStrategy } from './auth/jwt.strategy';
import { AuthController } from './AuthController';
import { User, UserRole } from './entity/User.entity';

app.use(morgan('tiny'))


useExpressServer(app, {
    controllers: [UserController, TodoController, PostController, AuthController],
    validation: true,
    authorizationChecker: async (action: Action, roles: string[]) => {
        const req = action.request;
        const res = action.response;

        return new Promise<boolean>((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
                if (err || !user) return resolve(false); // unauthorized
                // attach user to request for later use
                req.user = user;
                if (user.role === UserRole.ADMIN) return resolve(true);
                if (roles.length && !roles.includes(user.role)) return resolve(false);
                resolve(true); // authorized
            })(req, res);
        });
    }
});

AppDataSource.initialize().then(async () => {
    passport.use(jwtStrategy);
    app.use(passport.initialize());
    app.listen(3000, () => {
        console.log(`Example app listening on port 3000`)
    })
}).catch((err) => {
    console.error('error during Data Source initialization', err);
});

