import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test_chapter } from "@prisma/client";
import { SysTestEntity } from "../sys.test.entity/sys.test.entity";
import { SysTestPaperEntity } from "../sys.test.paper.entity/sys.test.paper.entity";

@ObjectType()
export class SysTestChapterEntity extends BaseEntity implements sys_test_chapter {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  desc: string;

  @Field(() => Int)
  single_count: number;

  @Field(() => Int)
  multiple_count: number;

  @Field(() => Int)
  judge_count: number;

  @Field({ nullable: true })
  PPT: string;

  @Field({ nullable: true })
  PDF: string;

  @Field({ nullable: true })
  video: string;

  @Field({ nullable: true })
  one2one: string;

  @Field({ nullable: true })
  outline: string;

  @Field(() => Int)
  money: number;

  @Field(() => Boolean)
  is_test: boolean;

  @Field(() => Int)
  sys_testId: number;

  @Field(() => SysTestEntity, { nullable: true })
  sys_test?: SysTestEntity;

  @Field(() => [SysTestPaperEntity], { nullable: true })
  papers?: SysTestPaperEntity[]
}
