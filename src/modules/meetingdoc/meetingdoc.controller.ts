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
} from '@nestjs/common';
import { MeetingdocService } from './meetingdoc.service';
import { CreateMeetingdocDto } from './dto/create-meetingdoc.dto';
import { UpdateMeetingdocDto } from './dto/update-meetingdoc.dto';
import type { UserRequest } from '../../interfaces/user-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(FileInterceptor('docfile', multerConfig('document')))
@Controller('meetingdocs')
export class MeetingdocController {
  constructor(private readonly meetingdocService: MeetingdocService) {}

  @Post()
  @Roles(2)
  create(
    @UploadedFile() docfile: Express.Multer.File,
    @Req() req: UserRequest,
    @Body() createMeetingdocDto: CreateMeetingdocDto,
  ) {
    // ✅ บังคับต้องมี file
    if (!docfile) {
      throw new BadRequestException('docfile is required');
    }

    const Docfilename = docfile.filename;
    if (Docfilename) {
      createMeetingdocDto.docfile = Docfilename;
    }
    return this.meetingdocService.create(
      createMeetingdocDto,
      req.user,
      Docfilename,
    );
  }

  @Get()
  @Roles(2)
  findAll(@Req() req: UserRequest) {
    return this.meetingdocService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingdocService.findOne(+id);
  }

  @Put(':id')
  @Roles(2)
  update(
    @Param('id') id: string,
    @UploadedFile() docfile: Express.Multer.File,
    @Body() updateMeetingdocDto: UpdateMeetingdocDto,
  ) {
    if (docfile) {
      updateMeetingdocDto.docfile = docfile.filename;
    }
    return this.meetingdocService.update(+id, updateMeetingdocDto);
  }

  @Delete(':id')
  @Roles(2)
  remove(@Param('id') id: string) {
    return this.meetingdocService.remove(+id);
  }
}
