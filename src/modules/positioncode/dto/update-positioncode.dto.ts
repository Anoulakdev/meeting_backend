import { PartialType } from '@nestjs/mapped-types';
import { CreatePositioncodeDto } from './create-positioncode.dto';

export class UpdatePositioncodeDto extends PartialType(CreatePositioncodeDto) {}
