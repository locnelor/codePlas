import { Module } from '@nestjs/common';
import { SoftwareResolver } from './software.resolver';
import { PrismaModule } from '@app/prisma';
import { SoftwareService } from './software.service';
import { FileModule } from '@app/file';

@Module({
  imports: [PrismaModule, FileModule],
  providers: [SoftwareResolver, SoftwareService]
})
export class SoftwareModule { }
