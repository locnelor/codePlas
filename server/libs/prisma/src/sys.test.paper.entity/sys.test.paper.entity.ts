import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test_paper } from "@prisma/client";
import { SysTestPaperQuestionEntity } from "../sys.test.paper.question.entity/sys.test.paper.question.entity";

@ObjectType()
export class SysTestPaperEntity extends BaseEntity implements sys_test_paper {
  @Field(() => Int)
  sys_userId: number;

  @Field(() => Int)
  sys_test_chapterId: number;

  @Field(() => Boolean)
  is_end: boolean;

  @Field(() => Int)
  correct: number;

  @Field(() => Int)
  wrong: number;

  @Field(() => Int)
  un_answer: number;

  @Field(() => Int)
  score: number;

  @Field(() => [SysTestPaperQuestionEntity], { nullable: true })
  sys_test_paper_question?: SysTestPaperQuestionEntity[];
}
