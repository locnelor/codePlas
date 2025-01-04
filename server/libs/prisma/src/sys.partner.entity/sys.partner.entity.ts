import { sys_partner } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SysPartnerEntity extends BaseEntity implements sys_partner {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;
}
