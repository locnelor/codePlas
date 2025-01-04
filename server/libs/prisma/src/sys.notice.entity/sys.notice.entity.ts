import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { $Enums, sys_notice } from "@prisma/client";
import { SysUserEntity } from "../sys.user.entity/sys.user.entity";


@ObjectType()
export class SysNoticeEntity extends BaseEntity implements sys_notice {
  @Field(() => String)
  type: $Enums.notice_type;
  
  @Field(() => Int)
  view: number;

  @Field()
  title: string;

  @Field()
  sys_userId: number;

  @Field(() => SysUserEntity, { nullable: true })
  creator?: SysUserEntity

  @Field({ nullable: true })
  context?: string
}
