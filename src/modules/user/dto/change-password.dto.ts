import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldpassword: string;

  @IsString()
  @IsNotEmpty()
  password1: string;

  @IsString()
  @IsNotEmpty()
  password2: string;
}
