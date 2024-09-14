import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalService } from './rental.service';
import { ParseIntPipe } from 'src/pipes/parce-int.pipe';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRental(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.createRental(createRentalDto);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getRentalById(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.getRentalById(id);
  }

  @Get('/user/:id')
  @UsePipes(new ValidationPipe())
  getRentalByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.getRentalByUserId(id);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAllRentals() {
    return this.rentalService.getAllRentals();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  deleteRentalById(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.deleteRentalById(id);
  }
}
