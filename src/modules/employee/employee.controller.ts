import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
// import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Roles(1)
  create() {
    return this.employeeService.create();
  }

  @Get()
  @Roles(1)
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }
}
