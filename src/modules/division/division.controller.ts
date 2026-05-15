import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DivisionService } from './division.service';
// import { CreateDivisionDto } from './dto/create-division.dto';
// import { UpdateDivisionDto } from './dto/update-division.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('divisions')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Post()
  @Roles(1)
  create() {
    return this.divisionService.create();
  }

  @Get()
  @Roles(1)
  findAll(@Query('departmentId') departmentId?: number) {
    return this.divisionService.findAll(departmentId);
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.divisionService.findOne(+id);
  }
}
