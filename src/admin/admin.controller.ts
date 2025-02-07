import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Item } from 'src/transaction/entities/item.entity';
import { CreateItemDto } from 'src/transaction/dto/create-item.dto';
import { UpdateItemDto } from 'src/transaction/dto/update-item.dto';

@ApiTags('Admin') // Tambahkan Tag untuk Swagger
@Controller('admin') // Perbaiki dari 'barang' menjadi 'admin'
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('item')
  getAll(): Promise<Item[]> {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('item/:id')
  getOne(@Param('id') itemId: string): Promise<Item> {
    return this.adminService.findOne(itemId);
  }

  @Post('item')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create New Item' })
  @ApiResponse({ status: 201, description: 'Item Berhasil Ditambahkan' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateItemDto})
  async create(@Body() createItemDto: CreateItemDto) {
    return this.adminService.saveItem(createItemDto);
  }
  
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Patch('item/:id')
  async update(@Param('id') itemId: string, @Body() data: UpdateItemDto): Promise<Item> {
    return this.adminService.update(itemId, data);
  }

  @ApiOperation({ summary: 'Delete item' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Delete('item/:id')
  async delete(@Param('id') itemId: string) {
    return this.adminService.remove(itemId);
  }
}
