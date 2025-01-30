import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryUserDto } from './dto/query-user.dto';
import { ChangeNewPasswordDto } from './dto/change-password.dto';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Profile' })
  async getProfile(@Request() request: Request): Promise<User> {
    const user = request['user'] as JwtPayload;
    return this.usersService.getProfile(user.user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User Profile and Avatar' })
  @ApiResponse({
    status: 201,
    description: 'Profile berhasil diperbarui',
  })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: UpdateProfileDto })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Request() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<User> {
    const user = request['user'] as JwtPayload;

    return this.usersService.updateProfile(user.user_id, updateProfileDto, file);
  }

  @ApiTags('admin')
  @UseGuards(AuthGuard('admin-jwt'))
  @Get('list')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List All User' })
  async getListUser(@Query() queryDto: QueryUserDto) {
    const { page = 1, limit = 10 } = queryDto;
    return this.usersService.getListUser(page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  @ApiBearerAuth()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Change Password' })
  @ApiBody({ type: ChangeNewPasswordDto })
  async changePassword(
    @Request() req,
    @Body() changeNewPassword: ChangeNewPasswordDto,
  ) {
    return this.usersService.changePassword(req.user, changeNewPassword);
  }
}