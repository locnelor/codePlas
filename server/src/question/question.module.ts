import { Module } from '@nestjs/common';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';
import { PrismaModule } from '@app/prisma';
import { FileModule } from '@app/file';
import { HashModule } from '@app/hash';

@Module({
  imports: [
    PrismaModule,
    FileModule,
    HashModule
  ],
  providers: [QuestionResolver, QuestionService]
})
export class QuestionModule { }
