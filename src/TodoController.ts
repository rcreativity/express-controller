import axios, { patch } from 'axios';
import { Request, Response } from 'express';
import { Body, Controller, Get, Param, Patch, Post, Put, Req, Res } from "routing-controllers";
import NodeCache from "node-cache"

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

interface Todo {
    title: string,
    completed: boolean
}

@Controller()
export class TodoController {
    @Get('/todos')
    async fetchTodos(@Res() response: Response) {
        const cacheKey = "todos";
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log("✅ Returning data from cache");
            return cachedData;
        }
        try {
            console.log("⏳ Fetching fresh data...");
            const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
            cache.set(cacheKey, res.data);
            return response.send(res.data);
        } catch (error) {
            console.error(error);
        }

    }

    @Get('/todos/:id')
    async fetchSingleTodos(@Param("id") id: number, @Res() response: Response) {
        const cacheKey = `todos/${id}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log("✅ Returning single data from cache");
            return cachedData;
        }
        try {
            console.log("⏳ Fetching single fresh data...");
            const { data } = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
            cache.set(cacheKey, data);
            return response.send(data);
        } catch (error) {
            console.error(error);
        }
    }

    @Post('/todos')
    async postTodo(@Body() todo: Todo) {
        try {
            const { data } = await axios.post(`https://jsonplaceholder.typicode.com/todos`, todo);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    @Put('/todos/:id')
    async updateTodo(@Param("id") id: number, @Body() todo: Todo) {
        try {
            const { data } = await axios.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, todo);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}