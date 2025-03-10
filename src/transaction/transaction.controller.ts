import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('transaction') 
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'Get all wallet' })
  // getAll(): Promise<Wallet[]> {
  //   return this.transactionService.findAll();  
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/balance')
  @ApiBearerAuth()  
  @ApiOperation({ summary: 'User Balance' })
  async getUserBalance(@Request() request: Request) {
    const user = request['user'] as JwtPayload;
    return this.transactionService.getBalance(user.user_id);
  }
  
}
