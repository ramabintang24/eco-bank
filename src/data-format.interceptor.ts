import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiProperty } from '@nestjs/swagger';

// Kelas untuk informasi pagination
export class PaginationInfo {
  @ApiProperty({ description: 'Jumlah total item', example: 100 })
  totalItems: number;

  @ApiProperty({ description: 'Jumlah item per halaman', example: 10 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Halaman saat ini', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Jumlah total halaman', example: 10 })
  totalPages: number;
}

// Kelas untuk respons dasar
export class BasicDataResponse<T> {
  @ApiProperty({ description: 'Kode status respons', example: 200 })
  statusCode?: number;

  @ApiProperty({ description: 'Pesan respons', example: 'OK' })
  message?: string;

  @ApiProperty({ description: 'Status pemenuhan permintaan', example: 1 })
  fulfilled?: number;

  @ApiProperty({ description: 'Data respons' })
  data: T;

  @ApiProperty({
    description: 'Informasi paginasi',
    required: false,
    type: PaginationInfo, // Menggunakan kelas PaginationInfo
  })
  pagination?: PaginationInfo;
}

// Interceptor untuk memformat respons
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

        // Mendapatkan status kode dari respons HTTP
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const message = 'OK';
        const fulfilled = 1;

        // Jika data dan paginasi ada dalam respons
        if (response.data && response.pagination) {
          return {
            statusCode,
            message,
            fulfilled,
            data: response.data,
            pagination: response.pagination,
          };
        }

        // Respons tanpa paginasi
        return { statusCode, message, fulfilled, data: response };
      }),
    );
  }
}
