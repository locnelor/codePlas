import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test_group } from "@prisma/client";
import { SysTestEntity } from "../sys.test.entity/sys.test.entity";

@ObjectType()
export class SysTestGroupEntity extends BaseEntity implements sys_test_group {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  desc: string;

  @Field(() => [SysTestEntity], { nullable: true })
  tests?: SysTestEntity[];
}
