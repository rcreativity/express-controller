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
exports.PostController = void 0;
const routing_controllers_1 = require("routing-controllers");
const posts_entity_1 = require("./entity/posts.entity");
const AppSource_1 = __importDefault(require("./AppSource"));
const create_post_dto_1 = require("./create-post.dto");
const update_post_dto_1 = require("./update-post.dto");
const replace_post_dto_1 = require("./replace-post.dto");
var morgan = require('morgan');
let PostController = class PostController {
    postsRepository;
    constructor() {
        this.postsRepository = AppSource_1.default.getRepository(posts_entity_1.Posts);
    }
    async getAllPosts(request, response) {
        // return await this.postsRepository.find();
        const currentUser = request.user; // typecast to your User entity
        console.log('Current user name:', currentUser.name);
        // Fetch posts
        const posts = await this.postsRepository.find();
        return {
            user: currentUser.email, // when @Authorized()
            posts,
        };
    }
    async savePosts(post, response) {
        console.log('Request body:', post); // debug
        const savedPost = await this.postsRepository.save({
            blogTitle: post.blogTitle,
        });
        return savedPost;
    }
    // @UseInterceptor(function (action: Action, content: any) {
    //     // here you have content returned by this action. you can replace something
    //     // in it and return a replaced result. replaced result will be returned to the user
    //     // return content.blogTitle; // only returns blog title
    // })
    async findPosts(id) {
        const post = await this.postsRepository.findOne({
            where: { id },
        });
        if (!post) {
            throw new routing_controllers_1.NotFoundError(`Post with id ${id} not found`);
        }
        return post;
        // // query builder
        // const post = this.postsRepository
        //     .createQueryBuilder("user")
        //     .where("user.id = :id", { id: id })
        //     .getOne();
        // return post;
    }
    async deletePosts(id) {
        const deleteResult = await this.postsRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new routing_controllers_1.NotFoundError(`Post with id ${id} not found`);
        }
        return { message: `Post with id ${id} deleted successfully` };
    }
    async updatePost(id, postData) {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new routing_controllers_1.NotFoundError(`Post with id ${id} not found`);
        }
        this.postsRepository.merge(post, postData);
        const updatedPost = await this.postsRepository.save(post);
        return updatedPost;
    }
    async replacePost(id, postData) {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new routing_controllers_1.NotFoundError(`Post with id ${id} not found`);
        }
        post.blogTitle = postData.blogTitle;
        const updatedPost = await this.postsRepository.save(post);
        return updatedPost;
    }
};
exports.PostController = PostController;
__decorate([
    (0, routing_controllers_1.Get)()
    // @Authorized()
    ,
    (0, routing_controllers_1.Authorized)(['admin']),
    __param(0, (0, routing_controllers_1.Req)()),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAllPosts", null);
__decorate([
    (0, routing_controllers_1.Post)(),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "savePosts", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_1.Authorized)(['user']) // admin always has access to all resources set in index.ts authorizationChecker funtion
    // @UseInterceptor(function (action: Action, content: any) {
    //     // here you have content returned by this action. you can replace something
    //     // in it and return a replaced result. replaced result will be returned to the user
    //     // return content.blogTitle; // only returns blog title
    // })
    ,
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "findPosts", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePosts", null);
__decorate([
    (0, routing_controllers_1.Patch)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, replace_post_dto_1.ReplacePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "replacePost", null);
exports.PostController = PostController = __decorate([
    (0, routing_controllers_1.JsonController)('/posts'),
    (0, routing_controllers_1.UseAfter)(morgan('tiny')),
    __metadata("design:paramtypes", [])
], PostController);
