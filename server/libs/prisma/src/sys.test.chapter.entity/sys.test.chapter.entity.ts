import { sys_test_chapter } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SysTestQuestionEntity } from "../sys.test.question.entity/sys.test.question.entity";
import { SysTestPaperEntity } from "../sys.test.paper.entity/sys.test.paper.entity";

@ObjectType()
export class SysTestChapterEntity extends BaseEntity implements sys_test_chapter {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  sys_test_groupId: number;

  @Field(() => [SysTestQuestionEntity], { nullable: true })
  sys_test_question?: SysTestQuestionEntity[];

  @Field(() => [SysTestPaperEntity], { nullable: true })
  sys_test_paper?: SysTestPaperEntity[]

  @Field({ nullable: true })
  desc: string
}
