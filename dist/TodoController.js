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
exports.TodoController = void 0;
const axios_1 = __importDefault(require("axios"));
const routing_controllers_1 = require("routing-controllers");
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 60, checkperiod: 120 });
let TodoController = class TodoController {
    async fetchTodos(response) {
        const cacheKey = "todos";
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log("✅ Returning data from cache");
            return cachedData;
        }
        try {
            console.log("⏳ Fetching fresh data...");
            const res = await axios_1.default.get("https://jsonplaceholder.typicode.com/todos");
            cache.set(cacheKey, res.data);
            return response.send(res.data);
        }
        catch (error) {
            console.error(error);
        }
    }
    async fetchSingleTodos(id, response) {
        const cacheKey = `todos/${id}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log("✅ Returning single data from cache");
            return cachedData;
        }
        try {
            console.log("⏳ Fetching single fresh data...");
            const { data } = await axios_1.default.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
            cache.set(cacheKey, data);
            return response.send(data);
        }
        catch (error) {
            console.error(error);
        }
    }
    async postTodo(todo) {
        try {
            const { data } = await axios_1.default.post(`https://jsonplaceholder.typicode.com/todos`, todo);
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }
    async updateTodo(id, todo) {
        try {
            const { data } = await axios_1.default.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, todo);
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, routing_controllers_1.Get)('/todos'),
    __param(0, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "fetchTodos", null);
__decorate([
    (0, routing_controllers_1.Get)('/todos/:id'),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "fetchSingleTodos", null);
__decorate([
    (0, routing_controllers_1.Post)('/todos'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "postTodo", null);
__decorate([
    (0, routing_controllers_1.Put)('/todos/:id'),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "updateTodo", null);
exports.TodoController = TodoController = __decorate([
    (0, routing_controllers_1.Controller)()
], TodoController);
