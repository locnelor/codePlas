import { sys_outline } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SysOutlineEntity extends BaseEntity implements sys_outline {
  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  comment: string;

  @Field()
  name: string;
}
