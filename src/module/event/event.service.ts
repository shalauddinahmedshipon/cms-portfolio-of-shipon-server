import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  // ---------- CREATE ----------
  async create(dto: CreateEventDto) {
    // Check duplicate serialNo
    if (dto.serialNo !== undefined) {
      const exists = await this.prisma.event.findUnique({
        where: { serialNo: dto.serialNo },
      });
      if (exists) {
        throw new BadRequestException(
          `Event with serialNo ${dto.serialNo} already exists`,
        );
      }
    }

    return this.prisma.event.create({
      data: {
        ...dto,
        images: dto.images || [],
      },
    });
  }

  // ---------- UPDATE ----------
  async update(id: string, dto: UpdateEventDto, newImages: string[] = []) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Event not found');

    // Check duplicate serialNo if updating
    if (dto.serialNo !== undefined && dto.serialNo !== existing.serialNo) {
      const serialExists = await this.prisma.event.findUnique({
        where: { serialNo: dto.serialNo },
      });
      if (serialExists) {
        throw new BadRequestException(
          `Event with serialNo ${dto.serialNo} already exists`,
        );
      }
    }

    // Replace images if new uploaded
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

  // ---------- DELETE ----------
  async delete(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    for (const url of event.images || []) {
      await this.cloudinaryService.deleteImageByUrl(url);
    }

    return this.prisma.event.delete({ where: { id } });
  }

  // ---------- GET ALL ----------
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

  // ---------- GET ONE ----------
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}
