import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ example: 'ICPC Contest Moment' })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Gallery image',
  })
  image: any;
}
