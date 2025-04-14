import { Controller, Get, Request, UseGuards, Post, Body, Param, ClassSerializerInterceptor, UseInterceptors, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateTransactionDto } from './dto/setor.dto';
import { Transaction } from './entities/transaction.entity';
import { CreateIncomeDto } from './dto/income.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('transaction') 
@UseInterceptors(ClassSerializerInterceptor)
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

  @UseGuards(AuthGuard('admin-jwt'))
  @Get('admin/balance')
  @ApiBearerAuth()  
  @ApiOperation({ summary: 'Admin Balance' })
  async getAdminBalance(@Request() request: Request) {
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

  @UseGuards(AuthGuard('admin-jwt'))
  @Get('detailtransaction/:id')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Detail Transaction'})
  async getDetailtransaction(@Param('id') transactionId: string) {
    return this.transactionService.getDetailTransaction(transactionId);
  }

  @ApiTags('admin')
  @UseGuards(AuthGuard('admin-jwt'))
  @Get('admin/history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List All Transaction User' })
  async getAllTransaction(): Promise<Transaction[]> {
    return this.transactionService.getAllTransaction();
  }

  @Post('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiOperation({ summary: 'Create New Transaction' })
  @ApiResponse({ status: 201, description: 'Transaction Berhasil Ditambahkan' })
  @ApiBody({ type: CreateTransactionDto})
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    console.log("Received items:", createTransactionDto.items);
    console.log("Received Full:", createTransactionDto);
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Post('admin/income')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('admin-jwt'))
  @ApiResponse({ status: 200, description: 'Income Berhasil Ditambahkan' })
  @ApiBody({ type: CreateIncomeDto })
  async createIncome(
    @Body() createIncomeDto: CreateIncomeDto,
    @Request() req: any, // ambil request untuk mendapatkan user dari JWT
  ) {
    const name = req.user?.name; // ambil nama dari JWT payload
    return this.transactionService.createIncome(createIncomeDto, name);
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @ApiTags('admin')
  @Get('admin/finance')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List All User' })
  async getAllFinance(): Promise<Transaction[]> {
    return this.transactionService.getAllFinance();
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @ApiTags('admin')
  @Get('admin/profit')
  @ApiBearerAuth()
  async getTotalProfit(
    @Query('filter') filter: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all' = 'all',
  ) {
    return await this.transactionService.getTotalProfit(filter);
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @ApiTags('admin')
  @Post('admin/withdraw/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Withdraw' })
  @ApiBody({ type: WithdrawDto})
  @ApiConsumes('application/x-www-form-urlencoded')
  async withdraw(@Param('id') userId: string, @Body() withdrawDto: WithdrawDto,     @Request() req: any, // ambil request untuk mendapatkan user dari JWT
) {
    const name = req.user?.name; // ambil nama dari JWT payload
    return this.transactionService.withdraw(userId, withdrawDto, name);
  }
  
  }

  
