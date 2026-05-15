import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PositiongroupService } from './positiongroup.service';
// import { CreatePositiongroupDto } from './dto/create-positiongroup.dto';
// import { UpdatePositiongroupDto } from './dto/update-positiongroup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positiongroups')
export class PositiongroupController {
  constructor(private readonly positiongroupService: PositiongroupService) {}

  @Post()
  @Roles(1)
  create() {
    return this.positiongroupService.create();
  }

  @Get()
  @Roles(1)
  findAll() {
    return this.positiongroupService.findAll();
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.positiongroupService.findOne(+id);
  }
}
