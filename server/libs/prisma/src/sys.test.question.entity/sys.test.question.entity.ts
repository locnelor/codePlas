import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { $Enums, sys_test_question } from "@prisma/client";
import { SysTestChapterEntity } from "../sys.test.chapter.entity/sys.test.chapter.entity";
import { SysTestPaperOnQuestionEntity } from "../sys.test.paper.on.question.entity/sys.test.paper.on.question.entity";

@ObjectType()
export class SysTestQuestionEntity extends BaseEntity implements sys_test_question {
  @Field()
  title: string;

  @Field()
  answer: string;

  @Field(() => String)
  type: $Enums.sys_test_type;

  @Field()
  context: string;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  sys_test_chapterId: number;

  @Field(() => Int)
  test_count: number;

  @Field(() => Int)
  test_right_count: number;

  @Field(() => SysTestChapterEntity, { nullable: true })
  chapter?: SysTestChapterEntity

  @Field(() => [SysTestPaperOnQuestionEntity], { nullable: true })
  sys_test_paper_on_question?: SysTestPaperOnQuestionEntity[]
}
