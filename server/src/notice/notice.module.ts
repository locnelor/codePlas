import { Module } from '@nestjs/common';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import { PrismaModule } from '@app/prisma';
import { FileModule } from '@app/file';

@Module({
  imports: [PrismaModule, FileModule],
  providers: [NoticeResolver, NoticeService]
})
export class NoticeModule { }
