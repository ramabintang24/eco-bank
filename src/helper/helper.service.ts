import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
// import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

@Injectable()
export class HelperService {

  encryptData(data: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('your_32_byte_encryption_key_here', 'utf8');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    const result = iv.toString('hex') + ':' + encryptedData;

    return result;
  }

  decryptData(data: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('your_32_byte_encryption_key_here', 'utf-8');

    const [ivHex, encryptData] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedData = decipher.update(encryptData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }

  // Static salt used for generating MD5 hashes
  public salt = 'iniAsinSalti123';

  // Generate an MD5 hash for the given string
  public md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  // Combine phone, password, and salt to create a salted MD5 hash
  public passwordSalting(name:string, phone: string, password: string): string {
    const userToken = this.md5(this.salt + name); // Generate a user-specific token
    const newSalted = this.md5(this.salt + name + userToken + phone); // Combine token and password
    const fixSalted = this.md5(this.salt + phone + newSalted + password); // Combine token and password
    return fixSalted;
  }

  // Hash the salted password using bcrypt with a dynamically generated salt
  public async hashPassword(name:string, phone: string, password: string): Promise<string> {
    const salted = this.passwordSalting(name, phone, password); // Generate salted password
    const salt = await bcrypt.genSalt(10); // Generate bcrypt salt with 10 rounds
    return bcrypt.hash(salted, salt); // Return the hashed password
  }

  // Verify a plain password against the stored hashed password
  public async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Handle both $2y$ (PHP) and $2a$ (bcryptjs) prefixes
    const compatibleHash = hashedPassword.replace(/^\$2y\$/, '$2a$');
    return bcrypt.compare(plainPassword, compatibleHash); // Compare passwords
  }
}
