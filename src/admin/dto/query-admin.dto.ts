import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAdminDto {
  @ApiProperty({
    description: 'Page number (minimum: 1)',
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (minimum: 5, maximum: 20)',
    default: 10,
    minimum: 5,
    maximum: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(20)
  @Type(() => Number)
  limit?: number = 10;
}
