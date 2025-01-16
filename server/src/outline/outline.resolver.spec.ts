import { Test, TestingModule } from '@nestjs/testing';
import { OutlineResolver } from './outline.resolver';

describe('OutlineResolver', () => {
  let resolver: OutlineResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutlineResolver],
    }).compile();

    resolver = module.get<OutlineResolver>(OutlineResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
