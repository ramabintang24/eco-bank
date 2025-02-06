import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admin') // Tambahkan Tag untuk Swagger
@Controller('admin') // Perbaiki dari 'barang' menjadi 'admin'
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get()
  getAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new admin' })
  @ApiResponse({ status: 201, description: 'Created' })
  @Post()
  create(@Body() data: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(data);
  }

  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateAdminDto): Promise<Admin> {
    return this.adminService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.adminService.remove(id);
  }
}
