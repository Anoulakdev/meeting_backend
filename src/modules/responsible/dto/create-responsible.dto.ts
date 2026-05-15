import { IsNotEmpty, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateResponsibleDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  divisionId?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  officeId?: number[];
}
