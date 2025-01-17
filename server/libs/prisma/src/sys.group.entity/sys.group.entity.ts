import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_group } from "@prisma/client";


@ObjectType()
export class SysGroupEntity extends BaseEntity implements sys_group {
  @Field()
  name: string;
}
