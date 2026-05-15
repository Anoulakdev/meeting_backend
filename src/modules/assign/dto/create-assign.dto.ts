import { IsNotEmpty, IsInt, IsArray } from 'class-validator';

export class CreateAssignDto {
  @IsInt()
  @IsNotEmpty()
  meetingDocId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  userId: number[];
}
