import { IsNumber, IsOptional } from 'class-validator';

export class LoadPagingDto {
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  page: number;
}
