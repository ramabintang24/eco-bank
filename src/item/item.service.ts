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

  async saveItem(data: CreateItemDto): Promise<Item> {
    const newItem = this.itemRepository.create(data);
    return this.itemRepository.save(newItem);
  }

  async update(itemId: string, data: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(itemId);
    if (!item) {
      throw new NotFoundException('Item tidak ditemukan');
    }
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Data pembaruan tidak boleh kosong');
    }
    const updatedItem = await this.itemRepository.preload({
      item_id: itemId,
      ...data,
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
