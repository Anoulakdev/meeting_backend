import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignDto } from './create-assign.dto';

export class UpdateAssignDto extends PartialType(CreateAssignDto) {}
