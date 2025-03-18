import { Controller, Get, Request, UseGuards, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateTransactionDto } from './dto/setor.dto';
import { Transaction } from './entities/transaction.entity';
import { CreateIncomeDto } from './dto/income.dto';

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
  @Get('user/history')
  @ApiBearerAuth()  
  @ApiOperation({ summary: 'User History Transaction' })
  async getUserTransaction(@Request() request: Request) {
    const user = request['user'] as JwtPayload;
    return this.transactionService.getUserTransaction(user.user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('detailtransaction')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Detail transaction'})
  async getDetailtransaction(@Request() request: Request) {
    const user = request['detail'] as JwtPayload;
    return this.transactionService.getDetailTransaction(user.user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiTags('admin')
  @UseGuards(AuthGuard('admin-jwt'))
  @Get('admin/history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List All User' })
  async getAllTransaction(): Promise<Transaction[]> {
    return this.transactionService.getAllTransaction();
  }
  

  @Post('item')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Create New Item' })
  @ApiResponse({ status: 201, description: 'Item Berhasil Ditambahkan' })
  @ApiBody({ type: CreateTransactionDto})
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    console.log("Received items:", createTransactionDto.items);
    console.log("Received Full:", createTransactionDto);
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Post('income')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiResponse({status: 200, description: 'Income Berhasil Ditambahkan'})
  @ApiBody({ type: CreateIncomeDto})
    async createIncome(@Body() createIncomeDto: CreateIncomeDto) {
      return this.transactionService.createIncome(createIncomeDto);
    }
    @UseGuards(AuthGuard('jwt'))
  @ApiTags('admin')
  @UseGuards(AuthGuard('admin-jwt'))
  @Get('admin/history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List All User' })
  async getAllFinance(): Promise<Transaction[]> {
    return this.transactionService.getAllFinance();
  }
  }

  
