import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  department_name: string;

  @IsString()
  @IsNotEmpty()
  department_code: string;

  @IsString()
  @IsNotEmpty()
  department_status: string;
}
