import { Module } from '@nestjs/common';
import { PaperResolver } from './paper.resolver';

@Module({
  providers: [PaperResolver]
})
export class PaperModule {}
