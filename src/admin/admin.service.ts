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

  async findOne(id: number): Promise<Item> {
    const admin = await this.itemRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin dengan ID ${id} tidak ditemukan`);
    }
    return admin;
  }

  async saveItem(data: CreateItemDto): Promise<Item> {
    const newItem = this.itemRepository.create(data);
    return this.itemRepository.save(newItem);
  }

  async update(id: number, data: UpdateItemDto): Promise<Item> {
    const admin = await this.findOne(id); // Pastikan admin ditemukan
    await this.itemRepository.update(id, data);
    return this.itemRepository.findOne({ where: { id } }); // Ambil data terbaru
  }

  async remove(id: number): Promise<void> {
    const admin = await this.findOne(id); // Pastikan admin ditemukan
    await this.itemRepository.delete(id);
  }
}
