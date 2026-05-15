import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PositioncodeService } from './positioncode.service';
// import { CreatePositioncodeDto } from './dto/create-positioncode.dto';
// import { UpdatePositioncodeDto } from './dto/update-positioncode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positioncodes')
export class PositioncodeController {
  constructor(private readonly positioncodeService: PositioncodeService) {}

  @Post()
  @Roles(1)
  create() {
    return this.positioncodeService.create();
  }

  @Get()
  @Roles(1)
  findAll() {
    return this.positioncodeService.findAll();
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.positioncodeService.findOne(+id);
  }
}
