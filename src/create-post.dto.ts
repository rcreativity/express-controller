// create-post.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty({ message: 'blogTitle is required' })
    blogTitle: string;
}
