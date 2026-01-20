import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project' })
  name: string;

  @ApiProperty({ example: 'Awesome Project Title' })
  title: string;

  @ApiProperty({ example: 'This project is about...' })
  description: string;

  @ApiProperty({ example: 'NestJS, TypeScript, PostgreSQL' })
  technology: string;

  @ApiProperty({ example: 'https://live-site.com', required: false })
  liveSiteUrl?: string;

  @ApiProperty({ example: 'https://github.com/frontend', required: false })
  githubFrontendUrl?: string;

  @ApiProperty({ example: 'https://github.com/backend', required: false })
  githubBackendUrl?: string;

  @ApiProperty({ enum: ['LEARNING', 'LIVE'], example: 'LEARNING' })
  category: 'LEARNING' | 'LIVE';


}
