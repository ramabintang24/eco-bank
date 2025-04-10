import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Item } from 'src/item/entities/item.entity';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Item') // Tambahkan Tag untuk Swagger
@Controller('item') // Perbaiki dari 'barang' menjadi 'admin'
@UseInterceptors(ClassSerializerInterceptor)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('item')
  @ApiOperation({ summary: 'Get all Item' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil Semua Data Barang' })
  getAll(): Promise<Item[]> {
    return this.itemService.getItemAll();
  }

  @Get('item/:id')
  @ApiOperation({ summary: 'Get Item by ID' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil Data Barang' })
  getOne(@Param('id') itemId: string): Promise<Item> {
    return this.itemService.findOne(itemId);
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Post('item')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create New Item' })
  @ApiResponse({ status: 201, description: 'Item Berhasil Ditambahkan' })
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateItemDto})
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.itemService.saveItem(createItemDto, file);
  }
  
  @Patch('item/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Item berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Item tidak ditemukan' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateItemDto })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Item> {
    return this.itemService.update(itemId, updateItemDto, file);
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

