import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateSkillCategoryDto {
  @ApiProperty({ example: 'Backend' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;
}



export class CreateSkillDto {
  @ApiProperty({ example: 'NestJS' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;

  @ApiProperty({ example: 'category-id' })
  @IsString()
  categoryId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Skill icon',
  })
  icon: any;
}
