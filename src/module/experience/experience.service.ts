import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CreateExperienceDto } from './dto/create-expirience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateExperienceDto & { companyLogo?: string }) {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateExperienceDto & { companyLogo?: string },
  ) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) throw new NotFoundException('Experience not found');

    if (dto.companyLogo && experience.companyLogo) {
      await this.cloudinaryService.deleteImageByUrl(
        experience.companyLogo,
      );
    }

    return this.prisma.experience.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate
          ? new Date(dto.startDate)
          : undefined,
        endDate: dto.endDate
          ? new Date(dto.endDate)
          : undefined,
      },
    });
  }

  async delete(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) throw new NotFoundException('Experience not found');

    if (experience.companyLogo) {
      await this.cloudinaryService.deleteImageByUrl(
        experience.companyLogo,
      );
    }

    return this.prisma.experience.delete({ where: { id } });
  }

  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) throw new NotFoundException('Experience not found');
    return experience;
  }

  async getAll() {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
  }
}
