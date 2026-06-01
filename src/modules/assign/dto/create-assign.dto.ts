import { IsNotEmpty, IsInt, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateAssignDto {
  @IsInt()
  @IsNotEmpty()
  meetingDocId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  userId: number[];

  @IsBoolean()
  @IsOptional()
  includeWeekend?: boolean;
}
