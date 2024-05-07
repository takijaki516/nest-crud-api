import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { AddItemRequestDto } from './dto/add-item-request.dto';
import { ChangeQuantityRequestDto } from './dto/change-quantity-request.dto';

// NOTE: cartId보다는 cartItemId가 더 적절한 이름이라고 생각
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async getMyCarts(@GetCurrentUser('id') userId: string) {
    const productAndQuantityArr = await this.cartsService.getCarts(userId);

    return {
      message: 'Carts fetched successfully',
      data: productAndQuantityArr,
    };
  }

  // TODO: carts에서 동일한 productId로 add할시에 quantity만큼을 더해주기
  @Post()
  async addItemToCart(
    @GetCurrentUser('id') userId: string,
    @Body() addItemRequestDto: AddItemRequestDto,
  ) {
    const addedProduct = await this.cartsService.addItemToCart(
      userId,
      addItemRequestDto,
    );

    return {
      message: 'Product added to cart successfully',
      data: addedProduct,
    };
  }

  @Patch(':cartId')
  async changeQuantity(
    @GetCurrentUser('id') userId: string,
    @Param('cartId') cartId: string,
    @Body() changeQuantityRequestDto: ChangeQuantityRequestDto,
  ) {
    const updatedCartItem = await this.cartsService.changeQuantity(
      userId,
      cartId,
      changeQuantityRequestDto,
    );

    return {
      message: 'Quantity updated successfully',
      data: updatedCartItem,
    };
  }

  @Delete(':cartId')
  async deleteCart(
    @GetCurrentUser('id') userId: string,
    @Param('cartId') cartId: string,
  ) {
    await this.cartsService.deleteCart(userId, cartId);

    return {
      message: 'Cart deleted successfully',
    };
  }
}
