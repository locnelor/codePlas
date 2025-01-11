import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { SoftwareModule } from 'src/software/software.module';
import { PrismaModule } from '@app/prisma';
import { FileModule } from '@app/file';

@Module({
  imports: [
    SoftwareModule,
    PrismaModule,
    FileModule
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule { }
