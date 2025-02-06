import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
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
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.adminService.findOne(id);
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

  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @Put('item/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateItemDto): Promise<Item> {
    return this.adminService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @Delete('item/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.adminService.remove(id);
  }
}
