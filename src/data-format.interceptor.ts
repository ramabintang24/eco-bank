import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiProperty } from '@nestjs/swagger';

export class BasicDataResponse<T> {
  @ApiProperty({ description: 'Kode status respons', example: 200 })
  statusCode?: number;

  @ApiProperty({ description: 'Pesan respons', example: 'OK' })
  message?: string;

  @ApiProperty({ description: 'Status pemenuhan permintaan', example: 1 })
  fulfilled?: number;

  @ApiProperty({ description: 'Data respons' })
  data: T;

  // @ApiProperty({
  //   description: 'Informasi paginasi',
  //   required: false,
  //   type: 'object',
  //   properties: {
  //     totalItems: { type: 'number', description: 'Total item', example: 100 },
  //     itemsPerPage: {
  //       type: 'number',
  //       description: 'Item per halaman',
  //       example: 10,
  //     },
  //     currentPage: {
  //       type: 'number',
  //       description: 'Halaman saat ini',
  //       example: 1,
  //     },
  //     totalPages: { type: 'number', description: 'Total halaman', example: 10 },
  //   },
  // })
  // pagination?: {
  //   totalItems: number;
  //   itemsPerPage: number;
  //   currentPage: number;
  //   totalPages: number;
  // };
}

@Injectable()
export class BasicDataFormatInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BasicDataResponse<any>> {
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return null;
        }

        const statusCode = context.switchToHttp().getResponse().statusCode;
        const message = 'OK';
        const fulfilled = 1;

        if (response.data && response.pagination) {
          return {
            statusCode,
            message,
            fulfilled,
            data: response.data,
            pagination: response.pagination,
          };
        }

        return { statusCode, message, fulfilled, data: response };
      }),
    );
  }
}
