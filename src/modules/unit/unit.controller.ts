import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UnitService } from './unit.service';
// import { CreateUnitDto } from './dto/create-unit.dto';
// import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @Roles(1)
  create() {
    return this.unitService.create();
  }

  @Get()
  @Roles(1)
  findAll(
    @Query('divisionId') divisionId?: number,
    @Query('officeId') officeId?: number,
  ) {
    return this.unitService.findAll(divisionId, officeId);
  }

  @Get(':id')
  @Roles(1)
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(+id);
  }
}
