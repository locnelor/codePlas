import { Resolver } from '@nestjs/graphql';
import { MakeGqlAuthPowerGuard } from 'src/auth/auth.guard';
import { QuestionService } from './question.service';
import { PrismaService } from '@app/prisma';


export const QuestionGuard = MakeGqlAuthPowerGuard("/question", "题目管理")
@Resolver()
export class QuestionResolver {
  constructor(
    private readonly service: QuestionService,
    private readonly prisma: PrismaService
  ) { }

  
}
