// replace-post.dto.ts
import { IsString, Length } from 'class-validator';

export class ReplacePostDto {
    @IsString()
    @Length(1, 255)
    blogTitle: string;
}
