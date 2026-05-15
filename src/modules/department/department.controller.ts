import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
// import { CreateDepartmentDto } from './dto/create-department.dto';
// import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles(1)
  create() {
    return this.departmentService.create();
  }

  @Get()
  @Roles(1)
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(+id);
  }
}
