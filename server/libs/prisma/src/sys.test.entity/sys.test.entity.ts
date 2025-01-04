import { ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_test } from "@prisma/client";

@ObjectType()
export class SysTestEntity extends BaseEntity implements sys_test{
  
}
