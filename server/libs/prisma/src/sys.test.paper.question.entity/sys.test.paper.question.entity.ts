import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test_paper_question } from "@prisma/client";
import { SysTestPaperEntity } from "../sys.test.paper.entity/sys.test.paper.entity";
import { SysTestPaperOnQuestionEntity } from "../sys.test.paper.on.question.entity/sys.test.paper.on.question.entity";


@ObjectType()
export class SysTestPaperQuestionEntity extends BaseEntity implements sys_test_paper_question {
  @Field(() => Int)
  sys_test_paperId: number;

  @Field(() => SysTestPaperEntity, { nullable: true })
  paper?: SysTestPaperEntity;

  @Field(() => [SysTestPaperOnQuestionEntity], { nullable: true })
  questions?: SysTestPaperOnQuestionEntity[];
}
