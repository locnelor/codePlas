import { Module } from '@nestjs/common';
import { OutlineService } from './outline.service';
import { OutlineResolver } from './outline.resolver';
import { FileModule } from '@app/file';
import { PrismaModule } from '@app/prisma';
import { HashModule } from '@app/hash';
import { OutlineController } from './outline.controller';

@Module({
  imports: [FileModule, PrismaModule, HashModule],
  providers: [OutlineService, OutlineResolver],
  controllers: [OutlineController]
})
export class OutlineModule { }
