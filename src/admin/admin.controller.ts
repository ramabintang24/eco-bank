import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';
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

  @Get('item')
  @ApiOperation({ summary: 'Get all Item' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil Semua Data Barang' })
  getAll(): Promise<Item[]> {
    return this.adminService.findAll();
  }

  @Get('item/:id')
  @ApiOperation({ summary: 'Get Item by ID' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil Data Barang' })
  getOne(@Param('id') itemId: string): Promise<Item> {
    return this.adminService.findOne(itemId);
  }

  @Post('item')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Create New Item' })
  @ApiResponse({ status: 201, description: 'Item Berhasil Ditambahkan' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateItemDto})
  async create(@Body() createItemDto: CreateItemDto) {
    return this.adminService.saveItem(createItemDto);
  }
  
  @Patch('item/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateItemDto})
  async update(@Param('id') itemId: string, @Body() data: UpdateItemDto): Promise<Item> {
    return this.adminService.update(itemId, data);
  }

  @Delete('item/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Delete item' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async delete(@Param('id') itemId: string) {
    return this.adminService.remove(itemId);
  }
}
