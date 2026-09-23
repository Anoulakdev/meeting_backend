import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRelateddocDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  docfile?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  departmentId?: number;
}
