import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PositionService } from './position.service';
// import { CreatePositionDto } from './dto/create-position.dto';
// import { UpdatePositionDto } from './dto/update-position.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @Roles(1)
  create() {
    return this.positionService.create();
  }

  @Get()
  @Roles(1)
  findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }
}
