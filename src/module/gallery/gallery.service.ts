import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { GetGalleryQueryDto } from './dto/get-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(data: { title: string; image: string }) {
    return this.prisma.gallery.create({
      data,
    });
  }

  // ✅ PAGINATED GET
  async getAll(query: GetGalleryQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.gallery.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.gallery.count(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  // ✅ SINGLE GET
  async findOne(id: string) {
    const gallery = await this.prisma.gallery.findUnique({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    return gallery;
  }

  async delete(id: string) {
    const gallery = await this.prisma.gallery.findUnique({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    await this.cloudinaryService.deleteImageByUrl(gallery.image);

    return this.prisma.gallery.delete({
      where: { id },
    });
  }
}
