import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser, JwtAuthGuard } from './auth/auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/viewer")
  @UseGuards(AuthGuard("jwt"))
  getViewer(
    @CurrentUser() user
  ) {
    return user
  }
}
