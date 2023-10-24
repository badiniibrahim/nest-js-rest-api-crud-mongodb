import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from 'src/dto/comment/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { postId, content } = createCommentDto;
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.prismaService.comment.create({
      data: { content, userId, postId },
    });
    return { data: 'Comment created' };
  }

  async delete(userId: any, postId: any, commentId: any) {
    const comment = await this.prismaService.comment.findFirst({
      where: { commentId },
    });
    if (!comment.postId !== postId)
      throw new UnauthorizedException('Post id does not match');

    if (comment.userId !== userId) throw new ForbiddenException('Forbidden');

    await this.prismaService.comment.delete({ where: { commentId } });
    return { date: 'Comment deleted' };
  }
}
