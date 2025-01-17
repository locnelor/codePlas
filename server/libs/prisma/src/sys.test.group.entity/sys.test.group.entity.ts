import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test_group } from "@prisma/client";
import { SysTestChapterEntity } from "../sys.test.chapter.entity/sys.test.chapter.entity";

@ObjectType()
export class SysTestGroupEntity extends BaseEntity implements sys_test_group {
  @Field(() => Boolean)
  is_test: boolean;

  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  sys_testId: number;

  @Field(() => [SysTestChapterEntity], { nullable: true })
  sys_test_chapter?: SysTestChapterEntity[];

  @Field()
  PDF: string;

  @Field()
  PPT: string;

  @Field(() => Boolean)
  test: boolean;
}
