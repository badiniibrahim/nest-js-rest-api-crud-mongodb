import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { CreateCommentDto } from 'src/dto/comment/createComment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createCommentDto: CreateCommentDto, @Req() request: Request) {
    const userId = request.user['userId'];
    return this.commentService.create(createCommentDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(
    @Param('id') commentId: number,
    @Req() request: Request,
    @Body('postId') postId: any,
  ) {
    const userId = request.user['userId'];
    return this.commentService.delete(userId, postId, commentId);
  }
}
