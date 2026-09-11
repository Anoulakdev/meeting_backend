import { IsArray, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateAssignDto {
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  userId?: number[];

  @IsBoolean()
  @IsOptional()
  includeWeekend?: boolean;
}
