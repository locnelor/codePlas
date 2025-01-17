import { Module } from '@nestjs/common';
import { TestResolver } from './test.resolver';
import { FileModule } from '@app/file';
import { PrismaModule } from '@app/prisma';
import { TestService } from './test.service';

@Module({
  imports: [
    FileModule,
    PrismaModule
  ],
  providers: [TestResolver, TestService]
})
export class TestModule { }
