import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from 'src/item/entities/item.entity';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(itemId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { item_id: itemId } });
    if (!item) {
      throw new NotFoundException(`Item tidak ditemukan`);
    }
    return item;
  }

  async saveItem(data: CreateItemDto): Promise<Item> {
    const newItem = this.itemRepository.create(data);
    return this.itemRepository.save(newItem);
  }

  async update(itemId: string, data: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(itemId); // Pastikan item ditemukan

    if (!item) {
      throw new NotFoundException(`Item tidak ditemukan`);
    }

    // Preload data agar primary key (id) dikenali untuk update
    const updatedItem = await this.itemRepository.preload({
      item_id: itemId, // Primary key
      ...data,
    });

    return this.itemRepository.save(updatedItem); // Simpan dan kembalikan data terbaru
  }

  async remove(itemId: string): Promise<{ message: string }> {
    const item = await this.findOne(itemId);

    if (!item) {
      throw new NotFoundException(`Item tidak ditemukan`);
    }

    // Soft delete dengan mengatur kolom deletedAt
    await this.itemRepository.update(itemId, { deleted_at: new Date() });

    return {
      message: 'Item berhasil dihapus',
    };
  }
}
