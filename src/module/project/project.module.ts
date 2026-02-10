import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectCron } from './project.cron';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectCron],
})
export class ProjectModule {}
