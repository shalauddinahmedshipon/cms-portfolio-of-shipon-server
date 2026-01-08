import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty({ required: false })
  serialNo?: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  eventDate?: Date;

  @ApiProperty({
    enum: ['CONFERENCE', 'WORKSHOP', 'MEETUP', 'WEBINAR','CONTEST','HACKATHON'],
    required: false,
  })
  eventType?: 'CONFERENCE' | 'WORKSHOP' | 'MEETUP' | 'WEBINAR'|'CONTEST'|'HACKATHON';

  @ApiProperty({
    example: true,
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  images?: any[];
}
