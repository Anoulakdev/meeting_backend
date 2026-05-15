import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingdocDto } from './create-meetingdoc.dto';

export class UpdateMeetingdocDto extends PartialType(CreateMeetingdocDto) {}
