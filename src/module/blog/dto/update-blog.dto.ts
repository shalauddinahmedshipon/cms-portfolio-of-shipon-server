import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiPropertyOptional({ example: 1 })
  serialNo?: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional({
    enum: ['TECHNOLOGY', 'PROGRAMMING', 'LIFESTYLE', 'TUTORIAL', 'NEWS'],
  })
  category?: 'TECHNOLOGY' | 'PROGRAMMING' | 'LIFESTYLE' | 'TUTORIAL' | 'NEWS';

  @ApiPropertyOptional({
    example: ['nestjs', 'backend'],
    type: [String],
  })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Replace cover image',
  })
  coverImage?: any;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  isFeatured?: boolean;
}
