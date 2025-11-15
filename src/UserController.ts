import { Request, Response } from 'express';
import { Controller, Req, Res, Get, Param, Authorized, UseAfter } from 'routing-controllers';
var morgan = require('morgan')

@Controller()
@UseAfter(morgan('tiny'))
export class UserController {
  @Get('/users')
  getAll(@Req() request: Request, @Res() response: Response) {
    return response.send('Hello response!');
  }

  @Authorized()
  @Get("/users/:id")
    getOne(@Param("id") id: number, @Req() request: Request, @Res() response: Response) {
        return response.send(`The Param is ${id}`);
    }
}