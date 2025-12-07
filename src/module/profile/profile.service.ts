import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';


@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}


  async getProfile() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  // Update profile, or create if it doesn't exist
  async updateProfile(dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.upsert({
      where: {id:'main-profile'}, 
      create: { ...dto },
      update: { ...dto },
    });
    return profile;
  }
}
