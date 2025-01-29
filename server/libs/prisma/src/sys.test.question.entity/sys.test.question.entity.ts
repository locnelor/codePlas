import { sys_test_question } from "@prisma/client";
import { BaseEntity } from "../base.entity/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SysTestPaperEntity } from "../sys.test.paper.entity/sys.test.paper.entity";

@ObjectType()
export class SysTestQuestionEntity extends BaseEntity implements sys_test_question {
  @Field(() => Int)
  sys_test_paperId: number;

  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  status: boolean;

  @Field({ nullable: true })
  desc: string;

  @Field(() => SysTestPaperEntity)
  sys_test_paper?: SysTestPaperEntity
}
