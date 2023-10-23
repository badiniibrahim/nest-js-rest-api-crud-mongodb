import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/createPosrDeto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from 'src/dto/post/updatePostDto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  async createPost(createPostDto: CreatePostDto, userId: string) {
    const { body, title } = createPostDto;
    await this.prismaService.post.create({ data: { body, title, userId } });
    return { data: 'Post created' };
  }

  async getAll(userId: string) {
    const posts = await this.prismaService.post.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
            userId: true,
          },
        },
        Comment: {
          include: {
            user: {
              select: {
                username: true,
                userId: true,
              },
            },
          },
        },
      },
    });
    return posts;
  }

  async delete(userId: any, postId: any) {
    const post = await this.prismaService.post.findUnique({
      where: { postId: postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId) throw new ForbiddenException('Forbidden');

    await this.prismaService.post.delete({ where: { postId: postId } });
    return { data: 'Post deleted' };
  }

  async update(userId: any, postId: any, updatePostDto: UpdatePostDto) {
    const post = await this.prismaService.post.findUnique({
      where: { postId: postId },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.userId !== userId) throw new ForbiddenException('Forbidden');

    await this.prismaService.post.update({
      where: { postId },
      data: { ...updatePostDto },
    });
    return { data: 'Post updated' };
  }
}
