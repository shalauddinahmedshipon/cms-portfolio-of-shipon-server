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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { SkillService } from './skill.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import sendResponse from '../utils/sendResponse';
import { CreateSkillCategoryDto, CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillCategoryDto, UpdateSkillDto } from './dto/update-skill.dto';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('Skill')
@Controller('skill')
export class SkillController {
  constructor(
    private readonly skillService: SkillService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ---------- CATEGORY ----------
  @Post('category')
  async createCategory(
    @Body() dto: CreateSkillCategoryDto,
    @Res() res: Response,
  ) {
    const data = await this.skillService.createCategory(dto);

    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Skill category created',
      data,
    });
  }

  // ---------- SKILL ----------
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSkillDto })
  @UseInterceptors(FileInterceptor('icon'))
  async createSkill(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const iconUrl = await this.cloudinaryService.uploadImage(file, 'skill');

    const skill = await this.skillService.createSkill({
      name: body.name,
      order: Number(body.order),
      categoryId: body.categoryId,
      icon: iconUrl,
    });

    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Skill created',
      data: skill,
    });
  }


  @ApiOperation({ summary: 'Get all skill categories with their skills' })
@Get('categories')
@Public()
async getAllCategories(@Res() res: Response) {
  const data = await this.skillService.getAllCategoriesWithSkills();

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Skill categories fetched successfully',
    data,
  });
}



@Patch('category/:id')
@ApiOperation({ summary: 'Update a skill category' })
async updateCategory(
  @Param('id') id: string,
  @Body() dto: UpdateSkillCategoryDto,
  @Res() res: Response
) {
  const updated = await this.skillService.updateCategory(id, dto);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Skill category updated successfully',
    data: updated,
  });
}

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSkillDto })
  @UseInterceptors(FileInterceptor('icon'))
  async updateSkill(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const iconUrl = file
      ? await this.cloudinaryService.uploadImage(file, 'skill')
      : undefined;

    const data = await this.skillService.updateSkill(id, {
      ...body,
      order: body.order ? Number(body.order) : undefined,
      icon: iconUrl,
    });

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Skill updated',
      data,
    });
  }

  
@ApiOperation({ summary: 'Delete a skill category and all its skills' })
@Delete('category/:id')
async deleteCategory(
  @Param('id') id: string,
  @Res() res: Response
) {
  const data = await this.skillService.deleteCategory(id);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Skill category deleted successfully',
    data,
  });}



  @Delete(':id')
  async deleteSkill(@Param('id') id: string, @Res() res: Response) {
    const data = await this.skillService.deleteSkill(id);

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Skill deleted',
      data,
    });
  }

  // ---------- PUBLIC GET ----------
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all skills grouped by category' })
  async getAll(@Res() res: Response) {
    const data = await this.skillService.getAllGrouped();

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Skills fetched successfully',
      data,
    });
  }

  
}
