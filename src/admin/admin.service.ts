import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from 'src/transaction/entities/item.entity';
import { CreateItemDto } from 'src/transaction/dto/create-item.dto';
import { UpdateItemDto } from 'src/transaction/dto/update-item.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(itemId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { item_id: itemId } });
    if (!item) {
      throw new NotFoundException(`Admin dengan ID ${itemId} tidak ditemukan`);
    }
    return item;
  }

  async saveItem(data: CreateItemDto): Promise<Item> {
    const newItem = this.itemRepository.create(data);
    return this.itemRepository.save(newItem);
  }

  async update(itemId: string, data: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(itemId); // Pastikan admin ditemukan
    await this.itemRepository.save(data);
    return item; // Ambil data terbaru
  }

  async remove(item_id: string): Promise<{ message: string }> {
    const item = await this.findOne(item_id);
  
    if (!item) {
      throw new Error('Item tidak ditemukan');
    }
  
    await this.itemRepository.delete(item_id);
  
    return {
      message: 'Item Berhasil Dihapus',
    };
  }  
}
