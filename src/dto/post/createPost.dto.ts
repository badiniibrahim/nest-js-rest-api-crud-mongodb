import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly body: string;
}
