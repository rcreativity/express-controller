// auth/jwt.strategy.ts
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { User } from '../entity/User.entity';
import AppDataSource from '../AppSource';
import { Repository } from 'typeorm';

const userRepo: Repository<User> = AppDataSource.getRepository(User);

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'YOUR_SECRET_KEY', // move to .env
};

export const jwtStrategy = new Strategy(opts, async (payload, done) => {
    try {
        const user = await userRepo.findOne({ where: { id: payload.id } });
        if (!user) return done(null, false);
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
});
