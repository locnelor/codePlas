import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { SoftwareModule } from 'src/software/software.module';
import { PrismaModule } from '@app/prisma';
import { FileModule } from '@app/file';
import { TestModule } from 'src/test/test.module';

@Module({
  imports: [
    SoftwareModule,
    PrismaModule,
    FileModule,
    TestModule
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule { }
