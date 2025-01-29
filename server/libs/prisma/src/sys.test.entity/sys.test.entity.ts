import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test } from "@prisma/client";
import { SysTestGroupEntity } from "../sys.test.group.entity/sys.test.group.entity";
import { SysTestChapterEntity } from "../sys.test.chapter.entity/sys.test.chapter.entity";

@ObjectType()
export class SysTestEntity extends BaseEntity implements sys_test {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  desc: string;

  @Field(() => Int)
  sys_test_groupId: number;

  @Field(() => SysTestGroupEntity, { nullable: true })
  sys_test_group?: SysTestGroupEntity;

  @Field(() => [SysTestChapterEntity], { nullable: true })
  chapters?: SysTestChapterEntity[];
}
