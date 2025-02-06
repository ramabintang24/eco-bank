import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin dengan ID ${id} tidak ditemukan`);
    }
    return admin;
  }

  async create(data: CreateAdminDto): Promise<Admin> {
    const newAdmin = this.adminRepository.create(data);
    return this.adminRepository.save(newAdmin);
  }

  async update(id: number, data: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id); // Pastikan admin ditemukan
    await this.adminRepository.update(id, data);
    return this.adminRepository.findOne({ where: { id } }); // Ambil data terbaru
  }

  async remove(id: number): Promise<void> {
    const admin = await this.findOne(id); // Pastikan admin ditemukan
    await this.adminRepository.delete(id);
  }
}
