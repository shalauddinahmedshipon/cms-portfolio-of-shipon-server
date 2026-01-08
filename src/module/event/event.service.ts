import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetEventsQueryDto } from './dto/get-event-query.dto';


@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        images: dto.images || [],
      },
    });
  }

  async update(id: string, dto: UpdateEventDto, newImages: string[] = []) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Event not found');

    if (newImages.length > 0) {
      for (const url of existing.images || []) {
        await this.cloudinaryService.deleteImageByUrl(url);
      }
      dto.images = newImages;
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.images ? { images: dto.images } : {}),
      },
    });
  }

  async delete(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    for (const url of event.images || []) {
      await this.cloudinaryService.deleteImageByUrl(url);
    }

    return this.prisma.event.delete({ where: { id } });
  }

  async getAllEvents(query: GetEventsQueryDto) {
    const { page = 1, limit = 10, search, eventType, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (eventType) where.eventType = eventType;
    if (typeof isActive === 'boolean') where.isActive = isActive;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { eventDate: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}
