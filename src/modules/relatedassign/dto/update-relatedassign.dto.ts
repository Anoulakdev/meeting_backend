import { PartialType } from '@nestjs/mapped-types';
import { CreateRelatedassignDto } from './create-relatedassign.dto';

export class UpdateRelatedassignDto extends PartialType(CreateRelatedassignDto) {}
