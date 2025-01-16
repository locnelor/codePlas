import { FileService } from '@app/file';
import { PrismaService } from '@app/prisma';
import { SysOutlineEntity } from '@app/prisma/sys.outline.entity/sys.outline.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CREATE_POWER, DELETE_POWER, MakeGqlAuthPowerGuard, UPDATE_POWER } from 'src/auth/auth.guard';
import { OutlineService } from './outline.service';


export const OutlineGuard = MakeGqlAuthPowerGuard("/outline", "知识大纲")
@Resolver()
export class OutlineResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: OutlineService,
    private readonly file: FileService
  ) {

  }

  // 知识大纲
  @Query(() => [SysOutlineEntity])
  queryOutline() {
    return this.prisma.sys_outline.findMany()
  }

  //新增知识大纲
  @Mutation(() => SysOutlineEntity)
  @UseGuards(OutlineGuard([CREATE_POWER]))
  async createOutline(
    @Args("name") name: string,
    @Args("order", { nullable: true, type: () => Int }) order: number,
    @Args("status", { nullable: true, type: () => Boolean }) status: boolean,
    @Args("comment", { nullable: true }) comment: string,
  ) {
    return this.prisma.sys_outline.create({
      data: {
        name,
        order,
        status,
        comment
      }
    })
  }

  //修改知识大纲文件名称
  @Mutation(() => SysOutlineEntity)
  @UseGuards(OutlineGuard([UPDATE_POWER]))
  updateOutline(
    @Args("name") name: string,
    @Args("order", { nullable: true, type: () => Int }) order: number,
    @Args("status", { nullable: true, type: () => Boolean }) status: boolean,
    @Args("comment", { nullable: true }) comment: string,
    @Args("id", { type: () => Int }) id: number,
  ) {
    return this.prisma.sys_outline.update({
      where: {
        id
      },
      data: {
        name,
        order,
        status,
        comment
      }
    })
  }

  //删除知识大纲
  @Mutation(() => Int)
  @UseGuards(OutlineGuard([DELETE_POWER]))
  async deleteOutline(
    @Args("ids", { type: () => [Int] }) ids: number[]
  ) {
    let count = 0;
    for (const id of ids) {
      const entity = await this.prisma.sys_outline.delete({
        where: {
          id
        }
      })
      if (!entity) continue;
      count++;
      this.file.destoryDirOrFile(this.service.getOutlineFilePath(entity));
    }
    return count;
  }

}
