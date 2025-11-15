"use strict";
// import app from "./server"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.listen(3000, () => {
//   console.log(`Example app listening on port 3000`)
// })
// openssl rand -hex 32  // to generate a secrete key like below
// like bc5594d990cdd01a10860174753b74263acdb5a7c78f2bf2a253bdae1d020ec8
require("reflect-metadata");
// The import 'reflect-metadata'; statement acts as a polyfill that extends JavaScript's global Reflect object with the metadata reflection API.
const routing_controllers_1 = require("routing-controllers");
const UserController_1 = require("./UserController");
const TodoController_1 = require("./TodoController");
const PostsController_1 = require("./PostsController");
const AppSource_1 = __importDefault(require("./AppSource"));
let express = require('express');
let app = express();
var morgan = require('morgan');
const passport_1 = __importDefault(require("passport"));
const jwt_strategy_1 = require("./auth/jwt.strategy");
const AuthController_1 = require("./AuthController");
const User_entity_1 = require("./entity/User.entity");
app.use(morgan('tiny'));
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [UserController_1.UserController, TodoController_1.TodoController, PostsController_1.PostController, AuthController_1.AuthController],
    validation: true,
    authorizationChecker: async (action, roles) => {
        const req = action.request;
        const res = action.response;
        return new Promise((resolve, reject) => {
            passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
                if (err || !user)
                    return resolve(false); // unauthorized
                // attach user to request for later use
                req.user = user;
                if (user.role === User_entity_1.UserRole.ADMIN)
                    return resolve(true);
                if (roles.length && !roles.includes(user.role))
                    return resolve(false);
                resolve(true); // authorized
            })(req, res);
        });
    }
});
AppSource_1.default.initialize().then(async () => {
    passport_1.default.use(jwt_strategy_1.jwtStrategy);
    app.use(passport_1.default.initialize());
    app.listen(3000, () => {
        console.log(`Example app listening on port 3000`);
    });
}).catch((err) => {
    console.error('error during Data Source initialization', err);
});
