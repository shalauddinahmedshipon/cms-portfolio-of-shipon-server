import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsUUID,
  IsArray,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'My Project', required: false })
  name?: string;

  @ApiProperty({ example: 'Awesome Project Title', required: false })
  title?: string;

  @ApiProperty({ example: 'This project is about...', required: false })
  description?: string;

  @ApiProperty({ example: 'NestJS, TypeScript, PostgreSQL', required: false })
  technology?: string;

  @ApiProperty({ example: 'https://live-site.com', required: false })
  liveSiteUrl?: string;

  @ApiProperty({ example: 'https://github.com/frontend', required: false })
  githubFrontendUrl?: string;

  @ApiProperty({ example: 'https://github.com/backend', required: false })
  githubBackendUrl?: string;

  @ApiProperty({ enum: ['LEARNING', 'LIVE'], required: false })
  category?: 'LEARNING' | 'LIVE';

  @ApiProperty({
    example: true,
    required: false,
    description: 'Mark project as favorite or not',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Soft delete toggle. If false, project is inactive',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isActive?: boolean;

  // 🔥 NEW
  @ApiProperty({
    type: [String],
    required: false,
    description: 'Existing image URLs to remove',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removedImages?: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Optional new images to upload',
  })
  images?: any[];
}




export class ReorderProjectDto {
  @ApiProperty({
    type: [String],
    example: ['clx1...', 'clx2...', 'clx3...'],
    description: 'Ordered project IDs (first = top)',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  ids: string[];
}

