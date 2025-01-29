import { sys_test_question } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SysTestQuestionEntity extends BaseEntity implements sys_test_question {
  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  desc: string;
}
