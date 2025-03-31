import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('Admin') // Tambahkan Tag untuk Swagger
@Controller('admin') // Perbaiki dari 'barang' menjadi 'admin'
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('admin-jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Profile' })
  async getProfile(@Request() request: Request): Promise<User> {
    const user = request['user'] as JwtPayload;
    return this.adminService.getProfile(user.user_id);
  }
}
