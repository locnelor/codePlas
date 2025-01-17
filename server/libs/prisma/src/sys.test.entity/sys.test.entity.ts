import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test } from "@prisma/client";
import { SysTestSourceEntity } from "../sys.test.source.entity/sys.test.source.entity";
import { SysTestChapterEntity } from "../sys.test.chapter.entity/sys.test.chapter.entity";
import { SysGroupEntity } from "../sys.group.entity/sys.group.entity";

@ObjectType()
export class SysTestEntity extends BaseEntity implements sys_test {
  @Field(() => Int)
  sys_groupId: number;

  @Field()
  name: string;

  @Field(() => SysGroupEntity, { nullable: true })
  group: SysGroupEntity;

  @Field(() => [SysTestSourceEntity], { nullable: true })
  sources?: SysTestSourceEntity[];

  @Field(() => [SysTestChapterEntity], { nullable: true })
  sys_test_chapter?: SysTestChapterEntity[];
}
