import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetBlogsQueryDto } from './dto/get-blogs.dto';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreateBlogDto, coverImageUrl?: string) {
    return this.prisma.blog.create({
      data: {
        serialNo: dto.serialNo,
        title: dto.title,
        content: dto.content,
        category: dto.category,
        tags: dto.tags,
        coverImage: coverImageUrl || null,
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto, newCoverUrl?: string) {
    const existing = await this.prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog not found');

    // replace cover image
    if (newCoverUrl) {
      if (existing.coverImage) {
        await this.cloudinary.deleteImageByUrl(existing.coverImage);
      }
      dto.coverImage = newCoverUrl;
    }

    return this.prisma.blog.update({
      where: { id },
      data: {
        serialNo: dto.serialNo,
        title: dto.title,
        content: dto.content,
        category: dto.category,
        tags: dto.tags,
        isActive: dto.isActive,
        isFeatured: dto.isFeatured,
        ...(dto.coverImage ? { coverImage: dto.coverImage } : {}),
      },
    });
  }

  async delete(id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    if (blog.coverImage) {
      await this.cloudinary.deleteImageByUrl(blog.coverImage);
    }

    return this.prisma.blog.delete({ where: { id } });
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async getAllBlogs(query: GetBlogsQueryDto) {
    const { page=1, limit=9, search, category, isActive, isFeatured } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    if (category) where.category = category;

    if (typeof isActive === 'boolean') where.isActive = isActive;

    if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;

    const [data, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
}
