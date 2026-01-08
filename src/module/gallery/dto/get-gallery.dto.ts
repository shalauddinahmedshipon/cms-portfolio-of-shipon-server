import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGalleryQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}
