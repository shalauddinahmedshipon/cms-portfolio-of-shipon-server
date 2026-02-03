import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import sendResponse from '../utils/sendResponse';
import { Response } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { ReorderProjectDto, UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectsQueryDto } from './dto/get-project.dto';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

@Post()
@ApiOperation({ summary: 'Create a project with images' })
@ApiConsumes('multipart/form-data')
@ApiBody({ type: CreateProjectDto })
@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
async create(
  @Body() body: any,
  @UploadedFiles() files: { images?: Express.Multer.File[] },
  @Res() res: Response,
) {
  const dto: CreateProjectDto = {
    name: body.name,
    title: body.title,
    description: body.description,
    technology: body.technology,
    liveSiteUrl: body.liveSiteUrl,
    githubFrontendUrl: body.githubFrontendUrl,
    githubBackendUrl: body.githubBackendUrl,
    category: body.category as 'LEARNING' | 'LIVE',
  };

  const uploadedUrls = files?.images
    ? await Promise.all(
        files.images.map((file) =>
          this.cloudinaryService.uploadImage(file, 'project'),
        ),
      )
    : [];

  const project = await this.projectService.create(dto, uploadedUrls);

  return sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Project created successfully',
    data: project,
  });
}


@Patch('reorder')
@ApiOperation({ summary: 'Reorder projects' })
async reorder(
  @Body() dto: ReorderProjectDto,
  @Res() res: Response,
) {
  await this.projectService.reorderProjects(dto.ids)

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Projects reordered successfully',
    data: null,
  })
}



  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a project (replace images)' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: UpdateProjectDto })
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  // async update(
  //   @Param('id') id: string,
  //   @Body() body: any,
  //   @UploadedFiles() files: { images?: Express.Multer.File[] },
  //   @Res() res: Response,
  // ) {
  //  const dto: UpdateProjectDto = {
  //   ...body,
  //   category: body.category as 'LEARNING' | 'LIVE',
  //   isFavorite: body.isFavorite === 'true' || body.isFavorite === true,
  //   isActive: body.isActive === 'true' || body.isActive === true,
  // };

  //  if (body.serialNo !== undefined) {
  //   dto['serialNo'] = Number(body.serialNo);
  // }


  //   const uploadedUrls = files?.images
  //     ? await Promise.all(
  //         files.images.map((file) =>
  //           this.cloudinaryService.uploadImage(file, 'project'),
  //         ),
  //       )
  //     : [];

  //   const project = await this.projectService.update(id, dto, uploadedUrls);

  //   return sendResponse(res, {
  //     statusCode: HttpStatus.OK,
  //     success: true,
  //     message: 'Project updated successfully',
  //     data: project,
  //   });
  // }  

 @Patch(':id')
@ApiConsumes('multipart/form-data')
@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
async update(
  @Param('id') id: string,
  @Body() body: any,                    // ← keep any for now
  @UploadedFiles() files: { images?: Express.Multer.File[] },
  @Res() res: Response,
) {
  // Manually build DTO – safer with multipart
  const dto = new UpdateProjectDto();

  if (body.name)          dto.name = body.name;
  if (body.title)         dto.title = body.title;
  if (body.description)   dto.description = body.description;
  if (body.technology)    dto.technology = body.technology;
  if (body.category)      dto.category = body.category as 'LEARNING' | 'LIVE';

  // URLs – allow empty string if sent
  if ('liveSiteUrl' in body)       dto.liveSiteUrl = body.liveSiteUrl || '';
  if ('githubFrontendUrl' in body) dto.githubFrontendUrl = body.githubFrontendUrl || '';
  if ('githubBackendUrl' in body)  dto.githubBackendUrl = body.githubBackendUrl || '';



  if ('isFavorite' in body) {
  dto.isFavorite =
    body.isFavorite === 'true' || body.isFavorite === true;
}

if ('isActive' in body) {
  dto.isActive =
    body.isActive === 'true' || body.isActive === true;
}


  if ('removedImages' in body) {
    dto.removedImages = Array.isArray(body.removedImages) ? body.removedImages : [body.removedImages];
  }

  const uploadedUrls = files?.images
    ? await Promise.all(
        files.images.map(file => this.cloudinaryService.uploadImage(file, 'project'))
      )
    : [];

  const updated = await this.projectService.update(id, dto, uploadedUrls);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: updated,
  });
}
  @Delete(':id')
  @ApiOperation({ summary: 'Delete project + cloudinary images' })
  async delete(@Param('id') id: string, @Res() res: Response) {
    const project = await this.projectService.delete(id);

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Project deleted successfully',
      data: project,
    });
  }

 @Get()
  @Public()
  @ApiOperation({ summary: 'Get all projects with pagination, search & filters' })
  
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'dashboard' })
  @ApiQuery({ 
    name: 'category', 
    required: false, 
    enum: ['LEARNING', 'LIVE'], 
    example: 'LEARNING' 
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    example: true,
    description: 'Filter active/inactive projects'
  })
  @ApiQuery({
    name: 'isFavorite',
    required: false,
    example: true,
    description: 'Filter favorite/non-favorite projects'
  })
  
  async getAllProjects(@Query() query: GetProjectsQueryDto,@Res() res: Response) {
    const result = await this.projectService.getAllProjects(query);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Projects fetched successfully',
      data: result,
    });
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.projectService.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Project retrieved successfully',
      data,
    });
  }
}
