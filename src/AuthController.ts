import { Request, Response } from 'express';
import { Body, JsonController, Post } from "routing-controllers";
import { Repository } from "typeorm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from "./entity/User.entity";
import AppDataSource from "./AppSource";
import { RegisterDto } from "./register.dto";
import { LoginDto } from './login.dto';

@JsonController('/auth')
export class AuthController {
    // Explicit
    // userRepository: Repository<User>

    // constructor() {
    //     this.userRepository = AppDataSource.getRepository(User);
    // }

    // implicit 
    constructor(private userRepository: Repository<User> = AppDataSource.getRepository(User)) { }


    @Post("/register")
    async regsiter(@Body() regsiteruser: RegisterDto, request: Request, response: Response) {
        const { name, email, password, role } = regsiteruser;
        console.log(name, email, password)
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.userRepository.save({ name, email, password: hashed, role });
        // await this.userRepository.save(user);
        return user;
    }

    @Post("/login")
    async login(@Body() loginuser: LoginDto, request: Request, response: Response) {
        const { email, password } = loginuser;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) return response.status(400).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return response.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        return {
            token: token
        }
    }
}