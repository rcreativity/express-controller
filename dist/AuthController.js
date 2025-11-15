"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_entity_1 = require("./entity/User.entity");
const AppSource_1 = __importDefault(require("./AppSource"));
const register_dto_1 = require("./register.dto");
const login_dto_1 = require("./login.dto");
let AuthController = class AuthController {
    userRepository;
    // Explicit
    // userRepository: Repository<User>
    // constructor() {
    //     this.userRepository = AppDataSource.getRepository(User);
    // }
    // implicit 
    constructor(userRepository = AppSource_1.default.getRepository(User_entity_1.User)) {
        this.userRepository = userRepository;
    }
    async regsiter(regsiteruser, request, response) {
        const { name, email, password, role } = regsiteruser;
        console.log(name, email, password);
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await this.userRepository.save({ name, email, password: hashed, role });
        // await this.userRepository.save(user);
        return user;
    }
    async login(loginuser, request, response) {
        const { email, password } = loginuser;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            return response.status(400).json({ message: 'Invalid credentials' });
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return response.status(400).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        return {
            token: token
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, routing_controllers_1.Post)("/register"),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "regsiter", null);
__decorate([
    (0, routing_controllers_1.Post)("/login"),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, routing_controllers_1.JsonController)('/auth'),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AuthController);
