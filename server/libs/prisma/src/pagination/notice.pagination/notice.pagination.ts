import { Field, ObjectType } from "@nestjs/graphql";
import { Pagination } from "../pagination";
import { SysNoticeEntity } from "@app/prisma/sys.notice.entity/sys.notice.entity";

@ObjectType()
export class NoticePagination extends Pagination {
  @Field(() => [SysNoticeEntity])
  data: SysNoticeEntity[]
}
