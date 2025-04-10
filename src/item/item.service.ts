import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Item } from 'src/item/entities/item.entity';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';


@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getItemAll(): Promise<Item[]> {
    return this.itemRepository.find({
      where: { deleted_at: IsNull() },
      order: { unit: 'DESC', created_at: 'ASC' },
    });
  }

  async findOne(itemId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { item_id: itemId } });
    if (!item) {
      throw new NotFoundException('Item tidak ditemukan');
    }
    return item;
  }

  async saveItem(data: CreateItemDto, file?: Express.Multer.File): Promise<Item> {
    let image_url = null;
  
    if (file) {
      const uploadDir = path.resolve('uploads', 'item');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
  
      const filename = `${Date.now()}-${file.originalname.split(' ').join('_')}.webp`;
      const filePath = path.join(uploadDir, filename);
  
      const buffer = await sharp(file.buffer)
        .resize(240, 240, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFormat('webp')
        .toBuffer();
  
      fs.writeFileSync(filePath, buffer);
      image_url = `uploads/item/${filename}`;
    }
  
    const newItem = this.itemRepository.create({
      ...data,
      image_url,
    });
  
    return this.itemRepository.save(newItem);
  }  

  async update(itemId: string, data: UpdateItemDto, file?: Express.Multer.File): Promise<Item> {
    const item = await this.findOne(itemId);
    if (!item) {
      throw new NotFoundException('Item tidak ditemukan');
    }
  
    let image_url = item.image_url;
  
    if (file) {
      const uploadDir = path.resolve('uploads', 'item');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
  
      const filename = `${itemId}.webp`;
      const filePath = path.join(uploadDir, filename);
  
      const buffer = await sharp(file.buffer)
        .resize(240, 240, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFormat('webp')
        .toBuffer();
  
      fs.writeFileSync(filePath, buffer);
      image_url = `uploads/item/${filename}`;
    }
  
    const updatedItem = await this.itemRepository.preload({
      item_id: itemId,
      ...data,
      image_url,
    });
  
    if (!updatedItem) {
      throw new NotFoundException('Item tidak ditemukan untuk diperbarui');
    }
  
    return this.itemRepository.save(updatedItem);
  }
  

  async remove(itemId: string): Promise<{ message: string }> {
    const item = await this.findOne(itemId);
    if (!item) {
      throw new NotFoundException('Item tidak ditemukan');
    }
    await this.itemRepository.update(itemId, { deleted_at: new Date() });
    return { message: 'Item berhasil dihapus' };
  }
}
