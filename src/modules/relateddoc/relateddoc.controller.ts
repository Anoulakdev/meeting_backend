import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RelateddocService } from './relateddoc.service';
import { CreateRelateddocDto } from './dto/create-relateddoc.dto';
import { UpdateRelateddocDto } from './dto/update-relateddoc.dto';
import type { UserRequest } from '../../interfaces/user-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relateddocs')
export class RelateddocController {
  constructor(private readonly relateddocService: RelateddocService) {}

  @Post()
  @Roles(2)
  @UseInterceptors(FileInterceptor('docfile', multerConfig('document')))
  create(
    @UploadedFile() docfile: Express.Multer.File,
    @Req() req: UserRequest,
    @Body() createRelateddocDto: CreateRelateddocDto,
  ) {
    if (!docfile) {
      throw new BadRequestException('docfile is required');
    }
    const Docfilename = docfile.filename;
    if (Docfilename) {
      createRelateddocDto.docfile = Docfilename;
    }
    return this.relateddocService.create(
      createRelateddocDto,
      req.user,
      Docfilename,
    );
  }

  @Get()
  @Roles(2)
  findAll(
    @Req() req: UserRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.relateddocService.findAll(req.user, {
      page,
      limit,
      search,
      departmentId,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relateddocService.findOne(+id);
  }

  @Put(':id')
  @Roles(2)
  @UseInterceptors(FileInterceptor('docfile', multerConfig('document')))
  update(
    @Param('id') id: string,
    @UploadedFile() docfile: Express.Multer.File,
    @Req() req: UserRequest,
    @Body() updateRelateddocDto: UpdateRelateddocDto,
  ) {
    if (docfile) {
      updateRelateddocDto.docfile = docfile.filename;
    }
    return this.relateddocService.update(+id, req.user, updateRelateddocDto);
  }

  @Delete(':id')
  @Roles(2)
  remove(@Param('id') id: string, @Req() req: UserRequest) {
    return this.relateddocService.remove(+id, req.user);
  }
}
