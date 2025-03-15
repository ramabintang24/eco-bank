import { Controller, Get, Request, UseGuards, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateTransactionDto } from './dto/setor.dto';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('user/transaction')
  @ApiBearerAuth()  
  @ApiOperation({ summary: 'User Balance' })
  async getUserTransaction(@Request() request: Request) {
    const user = request['user'] as JwtPayload;
    return this.transactionService.getUserTransaction(user.user_id);
  }
  

  @Post('item')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Create New Item' })
  @ApiResponse({ status: 201, description: 'Item Berhasil Ditambahkan' })
  @ApiBody({ type: CreateTransactionDto})
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    console.log("Received items:", createTransactionDto.items);
    console.log("Received Full:", createTransactionDto);
    return this.transactionService.createTransaction(createTransactionDto);
  }
}
