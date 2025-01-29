import { sys_test_paper } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SysTestChapterEntity } from "../sys.test.chapter.entity/sys.test.chapter.entity";
import { SysTestQuestionEntity } from "../sys.test.question.entity/sys.test.question.entity";

@ObjectType()
export class SysTestPaperEntity extends BaseEntity implements sys_test_paper {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  desc: string;

  @Field(() => Int)
  sys_test_chapterId: number;

  @Field(() => Boolean)
  is_free: boolean;

  @Field(() => SysTestChapterEntity, { nullable: true })
  chapter?: SysTestChapterEntity

  @Field(() => [SysTestQuestionEntity], { nullable: true })
  questions?: SysTestQuestionEntity[]
}
