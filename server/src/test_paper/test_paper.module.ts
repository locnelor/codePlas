import { Module } from '@nestjs/common';
import { TestPaperResolver } from './test_paper.resolver';

@Module({
  providers: [TestPaperResolver]
})
export class TestPaperModule {}
