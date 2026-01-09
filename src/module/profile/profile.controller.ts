import {
  Controller,
  Patch,
  Get,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import sendResponse from '../utils/sendResponse';
import { UpdateContactInfoDto, UpdateProfileDto } from './dto/profile.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // GET profile
  @Get()
  @ApiOperation({ summary: 'Get personal profile' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  async getProfile(@Res() res: Response) {
    const profile = await this.profileService.getProfile();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Profile fetched successfully',
      data: profile,
    });
  }

  // PATCH profile with avatar/banner upload
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update profile with optional avatar/banner images' })
  @ApiBody({
    description: 'Update Profile',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        designation: { type: 'string', example: 'Full Stack Developer' },
        headline: { type: 'string', example: 'Backend Developer' },
        bio: { type: 'string', example: 'I love building APIs and web apps.' },
        resumeUrl: { type: 'string', example: 'https://example.com/resume.pdf' },
        location: { type: 'string', example: 'Dhaka, Bangladesh' },
        avatar: { type: 'string', format: 'binary', description: 'Avatar image file' },
        banner: { type: 'string', format: 'binary', description: 'Banner image file' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File[]; banner?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    // Upload avatar if provided
    if (files?.avatar?.length) {
      dto.avatarUrl = await this.cloudinaryService.uploadImage(files.avatar[0], 'profile');
    }

    // Upload banner if provided
    if (files?.banner?.length) {
      dto.bannerUrl = await this.cloudinaryService.uploadImage(files.banner[0], 'profile');
    }

    const profile = await this.profileService.updateProfile(dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  }

@Patch('contact')
@ApiOperation({ summary: 'Update contact information' })
async updateContactInfo(
  @Body() dto: UpdateContactInfoDto,
  @Res() res: Response,
) {
  const data = await this.profileService.updateContactInfo(dto);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Contact info updated successfully',
    data,
  });
}




}
