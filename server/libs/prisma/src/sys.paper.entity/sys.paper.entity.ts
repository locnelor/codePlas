import { ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity/base.entity";
import { sys_paper } from "@prisma/client";

@ObjectType()
export class SysPaperEntity extends BaseEntity implements sys_paper {

}
