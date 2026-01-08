import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';



export class UpdateSkillCategoryDto {
  @ApiProperty({ required: false, example: 'Backend' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt({ message: 'Order must be an integer' })
  @Min(1, { message: 'Order must be at least 1' })
  order?: number;
}


export class UpdateSkillDto {
  @ApiPropertyOptional({ description: 'Skill name', example: 'NestJS' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Order for sorting', example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ description: 'Category ID of the skill', example: 'category-id' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Skill icon file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  icon?: any;
}
