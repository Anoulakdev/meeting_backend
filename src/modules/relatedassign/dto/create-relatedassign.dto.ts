import { IsNotEmpty, IsInt, IsArray } from 'class-validator';

export class CreateRelatedassignDto {
  @IsInt()
  @IsNotEmpty()
  relatedDocId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  userId: number[];
}
