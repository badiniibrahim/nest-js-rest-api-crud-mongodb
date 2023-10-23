import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly body?: string;
}
