import {
  Controller,
  // Get,
  Post,
  Body,
  Put,
  Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('responsibles')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Post()
  @Roles(1)
  create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return this.responsibleService.create(createResponsibleDto);
  }

  // @Get()
  // findAll() {
  //   return this.responsibleService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.responsibleService.findOne(+id);
  // }

  @Put(':id')
  @Roles(1)
  update(
    @Param('id') id: string,
    @Body() updateResponsibleDto: UpdateResponsibleDto,
  ) {
    return this.responsibleService.update(+id, updateResponsibleDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.responsibleService.remove(+id);
  // }
}
