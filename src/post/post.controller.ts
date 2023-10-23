import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from 'src/dto/post/createPosrDeto';
import { Request } from 'express';
import { UpdatePostDto } from 'src/dto/post/updatePostDto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const userId = request.user['userId'];
    return this.postService.createPost(createPostDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(@Req() request: Request) {
    const userId = request.user['userId'];
    return this.postService.getAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id') postId: number, @Req() request: Request) {
    const userId = request.user['userId'];
    return this.postService.delete(userId, postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  update(
    @Param('id') postId: number,
    @Req() request: Request,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = request.user['userId'];
    return this.postService.update(userId, postId, updatePostDto);
  }
}
