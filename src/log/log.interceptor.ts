import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from './log.service';
import { SuccessLog } from './entities/success-log.entity';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, ip, headers, body, user } = request;
    const path = url.split('?')[0];
    const id_user = user?.user_id;
    console.log("id_user", id_user);
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const responseTime = Date.now() - startTime;
        const rawBody = request['rawBody'];

        const logData: SuccessLog = {
          path,
          app: 'auth',
          method,
          query,
          ip,
          id_user,
          headers,
          body: body && Object.keys(body).length > 0 ? body : rawBody,
          responseTime,
          id: 0,
        };

        this.logService.createSuccessLog(logData).catch((error) => {
          console.error('Failed to create success log:', error);
        });
        console.log(`[${method}] ${path} ${responseTime}ms`);
      }),
    );
  }
}
