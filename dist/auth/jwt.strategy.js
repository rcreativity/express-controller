"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtStrategy = void 0;
// auth/jwt.strategy.ts
const passport_jwt_1 = require("passport-jwt");
const User_entity_1 = require("../entity/User.entity");
const AppSource_1 = __importDefault(require("../AppSource"));
const userRepo = AppSource_1.default.getRepository(User_entity_1.User);
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'YOUR_SECRET_KEY', // move to .env
};
exports.jwtStrategy = new passport_jwt_1.Strategy(opts, async (payload, done) => {
    try {
        const user = await userRepo.findOne({ where: { id: payload.id } });
        if (!user)
            return done(null, false);
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
});
