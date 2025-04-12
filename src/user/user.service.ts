import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { HelperService } from 'src/helper/helper.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
// import { BasicDataResponse } from 'src/data-format.interceptor';
import { ChangeNewPasswordDto } from './dto/change-password.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

const IMAGE_URL = process.env.OBJECT_BASE_URL;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // ===> GET USER PROFILE <===
  async getProfile(userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
      relations: ['wallet'],
    });
  
    if (!user) return null;
  
    const userProfileUrl = `${IMAGE_URL}/${user.profile_url}`;

    // Destructure data dari user
    const { wallet, ...userData } = user;
  
    return {
      ...userData, // Semua data user kecuali wallet
      profile_url: userProfileUrl,
      balance: wallet?.balance ?? 0, // Ambil balance saja, bukan seluruh objek Wallet
    };
  }
  
  
  

  // ===> UPDATE PROFILE & SAVE AVATAR (using Local Storage) <===
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User Tidak Ditemukan');
    }

    // Update Profile Fields
    user.name = updateProfileDto.name ?? user.name;
    user.birth_date = updateProfileDto.birth_date ?? user.birth_date;
    user.gender = updateProfileDto.gender ?? user.gender;
    user.phone_number = updateProfileDto.phone_number ?? user.phone_number;

    if (file) {
      const uploadDir = path.resolve('uploads', 'avatar', 'user');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${userId}.webp`;
      const filePath = path.join(uploadDir, filename);

      // Convert and resize the image to webp format (max 240x240px)
      const buffer = await sharp(file.buffer)
        .resize(240, 240, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFormat('webp')
        .toBuffer();

      // Save the processed image to local storage
      fs.writeFileSync(filePath, buffer);

      // Set the user's profile URL to the local file path (relative to the server root)
      user.profile_url = `uploads/avatar/user/${filename}`;
    }

    user.updated_at = new Date();
    await this.usersRepository.save(user);

    return user;
  }

  // ===> GET LIST USER <===
  async getListUser(): Promise<any[]> {
    const users = await this.usersRepository.find({
      where: { role: 'User' },
      order: { created_at: 'DESC' },
      relations: ['wallet'],
    });
  
    return users.map(({ wallet, ...user }) => ({
      ...user,
      profile_url: `${IMAGE_URL}/${user.profile_url}`,
      balance: wallet?.balance?? 0, // Ambil balance langsung
    }));
  }  

  // ===> CHANGE PASSWORD <===
  async changePassword(
    payload: JwtPayload,
    changeNewPassword: ChangeNewPasswordDto,
  ) {
    const { oldPassword, newPassword } = changeNewPassword;
    const user = await this.usersRepository.findOneBy({
      email: payload.email,
    });

    if (!user) {
      return null;
    }

    const saltedPassword = this.helperService.passwordSalting(
      payload.email,
      oldPassword,
    );

    const isOldPasswordValid = await this.helperService.verifyPassword(
      saltedPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const passwordHash = await this.helperService.hashPassword(
      payload.email,
      newPassword,
    );

    await this.usersRepository.update(
      { user_id: user.user_id },
      { password: passwordHash },
    );

    return {
      message: 'Password berhasil diganti',
    };
  }
  async remove(userId: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User Tidak Ditemukan');
    }
    await this.usersRepository.update(userId, { deleted_at: new Date() });
    return { message: 'User berhasil dihapus' };
  }
}
