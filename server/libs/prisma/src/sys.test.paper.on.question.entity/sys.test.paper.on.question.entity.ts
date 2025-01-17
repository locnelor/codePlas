import { Field, Int, ObjectType } from "@nestjs/graphql";
import { sys_test_paper_on_question } from "@prisma/client";
import { SysTestPaperQuestionEntity } from "../sys.test.paper.question.entity/sys.test.paper.question.entity";
import { SysTestQuestionEntity } from "../sys.test.question.entity/sys.test.question.entity";

@ObjectType()
export class SysTestPaperOnQuestionEntity implements sys_test_paper_on_question {
  @Field(() => Int)
  sys_test_paper_questionId: number;

  @Field(() => Int)
  sys_test_questionId: number;

  @Field()
  answer: string;

  @Field(() => [SysTestPaperQuestionEntity], { nullable: true })
  paper?: SysTestPaperQuestionEntity[]

  @Field(() => [SysTestQuestionEntity], { nullable: true })
  question?: SysTestQuestionEntity[]
}
