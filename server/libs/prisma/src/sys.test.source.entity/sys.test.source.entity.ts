import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test_source } from "@prisma/client";
import { SysTestEntity } from "../sys.test.entity/sys.test.entity";

@ObjectType()
export class SysTestSourceEntity extends BaseEntity implements sys_test_source {
  @Field()
  name: string;

  @Field()
  href: string;

  @Field(() => Int)
  sys_testId: number;

  @Field(() => SysTestEntity, { nullable: true })
  sys_test?: SysTestEntity
}
