import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { RelatedassignService } from './relatedassign.service';
import { CreateRelatedassignDto } from './dto/create-relatedassign.dto';
import { UpdateRelatedassignDto } from './dto/update-relatedassign.dto';
import type { UserRequest } from '../../interfaces/user-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relatedassigns')
export class RelatedassignController {
  constructor(private readonly relatedassignService: RelatedassignService) {}

  @Post()
  @Roles(2)
  create(@Body() createRelatedassignDto: CreateRelatedassignDto) {
    return this.relatedassignService.create(createRelatedassignDto);
  }

  @Get()
  findAll(
    @Req() req: UserRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.relatedassignService.findAll(req.user, {
      page,
      limit,
      search,
      departmentId,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relatedassignService.findOne(+id);
  }

  @Put(':id')
  @Roles(2)
  update(
    @Param('id') id: string,
    @Body() updateRelatedassignDto: UpdateRelatedassignDto,
  ) {
    return this.relatedassignService.update(+id, updateRelatedassignDto);
  }
}
