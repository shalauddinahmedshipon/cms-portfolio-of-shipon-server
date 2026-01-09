import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateContactInfoDto, UpdateProfileDto } from './dto/profile.dto';


@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}


  async getProfile() {
    const profile = await this.prisma.profile.findFirst({
      include:{
        contactInfo:true
      }
    });
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

  async updateContactInfo(dto: UpdateContactInfoDto) {
  return this.prisma.contactInfo.upsert({
    where: { profileId: 'main-profile' },
    create: {
      profileId: 'main-profile',
      ...dto,
    },
    update: {
      ...dto,
    },
  });
}

}
