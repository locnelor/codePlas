import { Test, TestingModule } from '@nestjs/testing';
import { TestPaperResolver } from './test_paper.resolver';

describe('TestPaperResolver', () => {
  let resolver: TestPaperResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestPaperResolver],
    }).compile();

    resolver = module.get<TestPaperResolver>(TestPaperResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
