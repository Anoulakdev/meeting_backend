import { PartialType } from '@nestjs/mapped-types';
import { CreatePositiongroupDto } from './create-positiongroup.dto';

export class UpdatePositiongroupDto extends PartialType(
  CreatePositiongroupDto,
) {}
