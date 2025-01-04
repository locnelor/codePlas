import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_software_platform } from "@prisma/client";

@ObjectType()
export class SysSoftwarePlatformEntity extends BaseEntity implements sys_software_platform {
  @Field()
  title: string;

  @Field()
  href: string;

  @Field()
  description: string;
}
