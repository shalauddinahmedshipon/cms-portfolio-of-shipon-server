import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectCron {
  private readonly logger = new Logger(ProjectCron.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Runs every 5 minutes
   * Keeps Render instance warm
   */
  @Cron('*/1 * * * *')
  async warmUpProjects() {
    try {
      await this.prisma.project.findMany({
        take: 1, // 🔥 VERY IMPORTANT → minimal DB load
        select: { id: true },
      });

      this.logger.log('Project warm-up cron executed successfully');
    } catch (error) {
      this.logger.error('Project warm-up cron failed', error);
    }
  }
}
