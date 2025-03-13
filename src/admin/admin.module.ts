import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
