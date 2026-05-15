import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { OfficeService } from './office.service';
// import { CreateOfficeDto } from './dto/create-office.dto';
// import { UpdateOfficeDto } from './dto/update-office.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offices')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @Roles(1)
  create() {
    return this.officeService.create();
  }

  @Get()
  @Roles(1)
  findAll(@Query('divisionId') divisionId?: number) {
    return this.officeService.findAll(divisionId);
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(+id);
  }
}
