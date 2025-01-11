import { PrismaService } from '@app/prisma';
import { NoticePagination } from '@app/prisma/pagination/notice.pagination/notice.pagination';
import { SysNoticeEntity } from '@app/prisma/sys.notice.entity/sys.notice.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { notice_type, Prisma } from '@prisma/client';
import { NoticeService } from './notice.service';
import { CREATE_POWER, DELETE_POWER, GqlCurrentUser, MakeGqlAuthPowerGuard, UPDATE_POWER } from 'src/auth/auth.guard';
import { SysUserEntity } from '@app/prisma/sys.user.entity/sys.user.entity';
import { UseGuards } from '@nestjs/common';
import { ForbiddenError } from '@nestjs/apollo';
import { FileService } from '@app/file';

const NoticeGuard = MakeGqlAuthPowerGuard("/notices", "公告管理")
@Resolver()
export class NoticeResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: NoticeService,
    private readonly file: FileService
  ) { }

  @Query(() => NoticePagination)
  async getNotices(
    @Args("page", { type: () => Int }) page: number,
    @Args("size", { type: () => Int }) size: number,
    @Args("title", { nullable: true }) title?: string,
    @Args("type", { type: () => String, nullable: true }) type?: notice_type,
    @Args("id", { type: () => Int, nullable: true }) id?: number,
    @Args("orderBy", { nullable: true, type: () => String }) orderBy: Prisma.SortOrder = 'desc',
  ) {
    const where: Prisma.sys_noticeWhereInput = {};
    if (!!title) {
      where.title = { contains: title };
    }
    if (!!id) {
      where.id = id;
    }
    if (!!type) {
      where.type = type
    }
    const total = await this.prisma.sys_notice.count({ where });
    const notices = await this.prisma.sys_notice.findMany({
      where,
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        id: orderBy
      },
      include: {
        creator: true
      }
    });
    return {
      total,
      data: notices,
      page,
      size
    }
  }

  @Query(() => SysNoticeEntity)
  async getNoticeById(
    @Args("id", { type: () => Int }) id: number,
  ) {
    const notice: SysNoticeEntity = await this.prisma.sys_notice.findUnique({
      where: {
        id
      },
      include: {
        creator: true
      }
    });
    const context = this.file.getFileContext(this.service.getNoticePath(notice));
    notice.context = context?.toString();
    return notice;
  }


  @Mutation(() => SysNoticeEntity)
  @UseGuards(NoticeGuard([CREATE_POWER]))
  async createNotice(
    @Args("title") title: string,
    @Args("type", { type: () => String }) type: notice_type,
    @GqlCurrentUser() user: SysUserEntity,
  ) {
    const notice = await this.prisma.sys_notice.create({
      data: {
        title,
        type,
        creator: {
          connect: {
            id: user.id
          }
        }
      }
    })
    return notice;
  }

  @Mutation(() => SysNoticeEntity)
  @UseGuards(NoticeGuard([UPDATE_POWER]))
  async updateNotice(
    @Args("id", { type: () => Int }) id: number,
    @Args("title") title: string,
    @Args("type", { type: () => String }) type: notice_type,
    @GqlCurrentUser() user: SysUserEntity
  ) {
    const notice = await this.prisma.sys_notice.update({
      where: {
        id
      },
      data: {
        title,
        type,
        creator: {
          connect: {
            id: user.id
          }
        }
      }
    })
    return notice;
  }

  @Mutation(() => Int)
  @UseGuards(NoticeGuard([DELETE_POWER]))
  async deleteNotice(
    @Args("ids", { type: () => [Int] }) ids: number[]
  ) {
    const result = await this.prisma.sys_notice.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    return result.count
  }

  @Mutation(() => Boolean)
  @UseGuards(NoticeGuard([UPDATE_POWER]))
  async updateNoticeContext(
    @Args("context") context: string,
    @Args("id", { type: () => Int }) id: number
  ) {
    const entity = await this.prisma.sys_notice.findUnique({ where: { id } });
    if (!entity) throw new ForbiddenError("公告不存在");
    const path = this.service.getNoticePath(entity);
    this.file.writeFile(path, context);
    return true;
  }
}
