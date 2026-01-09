import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) {}

  /* CREATE */
  async createAchievement(dto: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: {...dto,achievedAt:dto.achievedAt?new Date(dto?.achievedAt):undefined}
    });
  }

  /* GET ALL */
  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      orderBy: { achievedAt: 'desc' },
    });
  }

  /* GET SINGLE */
  async getAchievementById(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');
    return achievement;
  }

  /* UPDATE */
  async updateAchievement(id: string, dto: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.findUnique({ where: { id } });
    if (!achievement) throw new NotFoundException('Achievement not found');

    return this.prisma.achievement.update({
      where: { id },
      data: {...dto,achievedAt:dto.achievedAt?new Date(dto?.achievedAt):undefined},
    });
  }

  /* DELETE */
  async deleteAchievement(id: string) {
    const achievement = await this.prisma.achievement.findUnique({ where: { id } });
    if (!achievement) throw new NotFoundException('Achievement not found');

    return this.prisma.achievement.delete({ where: { id } });
  }
}
