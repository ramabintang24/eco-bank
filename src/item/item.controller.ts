import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Item } from 'src/item/entities/item.entity';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Item') // Tambahkan Tag untuk Swagger
@Controller('item') // Perbaiki dari 'barang' menjadi 'admin'
@UseInterceptors(ClassSerializerInterceptor)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('item')
  @ApiOperation({ summary: 'Get all Item' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil Semua Data Barang' })
  getAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get('item/:id')
  @ApiOperation({ summary: 'Get Item by ID' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil Data Barang' })
  getOne(@Param('id') itemId: string): Promise<Item> {
    return this.itemService.findOne(itemId);
  }

  @Post('item')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Create New Item' })
  @ApiResponse({ status: 201, description: 'Item Berhasil Ditambahkan' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateItemDto})
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.saveItem(createItemDto);
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
    return this.itemService.update(itemId, data);
  }

  @Delete('item/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Delete item' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async delete(@Param('id') itemId: string) {
    return this.itemService.remove(itemId);
  }
}

