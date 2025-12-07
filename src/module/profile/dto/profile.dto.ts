import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Full Stack Developer', description: 'Current designation' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: 'Backend developer with 5+ years experience', description: 'Short headline' })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional({ example: 'I love building APIs and web apps.', description: 'Short bio about the user' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/resume.pdf', description: 'Link to resume PDF' })
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh', description: 'Location of the user' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL after upload' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.jpg', description: 'Banner URL after upload' })
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

}
