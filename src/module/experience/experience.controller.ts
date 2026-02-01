import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ExperienceService } from './experience.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import sendResponse from '../utils/sendResponse';
import { CreateExperienceDto } from './dto/create-expirience.dto';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

 @Post()
@ApiConsumes('multipart/form-data')
@ApiBody({ type: CreateExperienceDto })
@UseInterceptors(FileInterceptor('companyLogo'))
async create(
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
  @Res() res: Response,
) {
  const logoUrl = file
    ? await this.cloudinaryService.uploadImage(file, 'experience')
    : undefined;

  // ✅ Normalize boolean here
  const normalizedBody: CreateExperienceDto & { companyLogo?: string } = {
    ...body,
    companyLogo: logoUrl,
    isCurrent: body.isCurrent === true || body.isCurrent === 'true', // convert string to boolean
  };

  const data = await this.experienceService.create(normalizedBody);

  return sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Experience created',
    data,
  });
}

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateExperienceDto })
  @UseInterceptors(FileInterceptor('companyLogo'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const logoUrl = file
      ? await this.cloudinaryService.uploadImage(file, 'experience')
      : undefined;

  const normalizedBody: UpdateExperienceDto & { companyLogo?: string } = {
  ...body,
  companyLogo: logoUrl,
  ...(body.isCurrent !== undefined
    ? { isCurrent: body.isCurrent === true || body.isCurrent === 'true' }
    : {}),
};
    const data = await this.experienceService.update(id,normalizedBody);

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Experience updated',
      data,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const data = await this.experienceService.delete(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Experience deleted',
      data,
    });
  }

  @Get()
  @Public()
  async getAll(@Res() res: Response) {
    const data = await this.experienceService.getAll();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Experiences fetched',
      data,
    });
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.experienceService.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Experience fetched',
      data,
    });
  }


}
