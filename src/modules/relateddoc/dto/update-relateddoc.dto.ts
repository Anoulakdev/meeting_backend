import { PartialType } from '@nestjs/mapped-types';
import { CreateRelateddocDto } from './create-relateddoc.dto';

export class UpdateRelateddocDto extends PartialType(CreateRelateddocDto) {}
