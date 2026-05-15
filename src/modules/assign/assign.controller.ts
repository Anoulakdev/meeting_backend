import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssignService } from './assign.service';
import { CreateAssignDto } from './dto/create-assign.dto';
import { UpdateAssignDto } from './dto/update-assign.dto';
import type { UserRequest } from '../../interfaces/user-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assigns')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}

  @Post()
  @Roles(2)
  create(@Body() createAssignDto: CreateAssignDto) {
    return this.assignService.create(createAssignDto);
  }

  @Get()
  findAll(@Req() req: UserRequest) {
    return this.assignService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignService.findOne(+id);
  }

  @Put(':id')
  @Roles(2)
  update(@Param('id') id: string, @Body() updateAssignDto: UpdateAssignDto) {
    return this.assignService.update(+id, updateAssignDto);
  }
}
