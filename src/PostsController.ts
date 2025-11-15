import { Request, Response } from 'express';
import { Controller, Req, Res, Get, Param, Authorized, UseAfter, Post, Body, JsonController, Delete, NotFoundError, Patch, Put, UseInterceptor, Action } from 'routing-controllers';
import { Repository } from 'typeorm';
import { Posts } from './entity/posts.entity';
import AppDataSource from './AppSource';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';
import { ReplacePostDto } from './replace-post.dto';
var morgan = require('morgan')

@JsonController('/posts')
@UseAfter(morgan('tiny'))
export class PostController {
    postsRepository: Repository<Posts>

    constructor() {
        this.postsRepository = AppDataSource.getRepository(Posts);
    }

    @Get()
    // @Authorized()
    @Authorized(['admin'])
    async getAllPosts(@Req() request: Request, @Res() response: Response) {
        // return await this.postsRepository.find();
        const currentUser = request.user as any; // typecast to your User entity
        console.log('Current user name:', currentUser.name);

        // Fetch posts
        const posts = await this.postsRepository.find();

        return {
            user: currentUser.email, // when @Authorized()
            posts,
        };
    }

    @Post()
    async savePosts(@Body() post: CreatePostDto, @Res() response: Response) {
        console.log('Request body:', post); // debug
        const savedPost = await this.postsRepository.save({
            blogTitle: post.blogTitle,
        });
        return savedPost;
    }

    @Get("/:id")
    @Authorized(['user']) // admin always has access to all resources set in index.ts authorizationChecker funtion
    // @UseInterceptor(function (action: Action, content: any) {
    //     // here you have content returned by this action. you can replace something
    //     // in it and return a replaced result. replaced result will be returned to the user
    //     // return content.blogTitle; // only returns blog title
    // })
    async findPosts(@Param("id") id: number,) {
        const post = await this.postsRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }

        return post;
        // // query builder
        // const post = this.postsRepository
        //     .createQueryBuilder("user")
        //     .where("user.id = :id", { id: id })
        //     .getOne();
        // return post;
    }

    @Delete("/:id")
    async deletePosts(@Param("id") id: number,) {
        const deleteResult = await this.postsRepository.delete(id);

        if (deleteResult.affected === 0) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }

        return { message: `Post with id ${id} deleted successfully` };
    }

    @Patch('/:id')
    async updatePost(
        @Param('id') id: number,
        @Body() postData: UpdatePostDto
    ): Promise<Posts> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }

        this.postsRepository.merge(post, postData);

        const updatedPost = await this.postsRepository.save(post);

        return updatedPost;
    }

    @Put('/:id')
    async replacePost(
        @Param('id') id: number,
        @Body() postData: ReplacePostDto
    ): Promise<Posts> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }

        post.blogTitle = postData.blogTitle;

        const updatedPost = await this.postsRepository.save(post);

        return updatedPost;
    }
}