// update-post.dto.ts
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @Length(1, 255)
    blogTitle?: string;
}
