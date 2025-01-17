import { FileService } from '@app/file';
import { PrismaService } from '@app/prisma';
import { SysGroupEntity } from '@app/prisma/sys.group.entity/sys.group.entity';
import { SysTestEntity } from '@app/prisma/sys.test.entity/sys.test.entity';
import { SysTestGroupEntity } from '@app/prisma/sys.test.group.entity/sys.test.group.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, GqlAuthGuard, MakeGqlAuthPowerGuard, UPDATE_POWER } from 'src/auth/auth.guard';
import { TestService } from './test.service';
import { ForbiddenError } from '@nestjs/apollo';
import { SysTestChapterEntity } from '@app/prisma/sys.test.chapter.entity/sys.test.chapter.entity';
import { SysTestQuestionEntity } from '@app/prisma/sys.test.question.entity/sys.test.question.entity';
import { sys_test_type } from '@prisma/client';
import { SysTestPaperEntity } from '@app/prisma/sys.test.paper.entity/sys.test.paper.entity';

export const TestGuard = MakeGqlAuthPowerGuard("/test", "模拟测试")
@Resolver()
export class TestResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
    private readonly service: TestService
  ) { }

  @Query(() => [SysGroupEntity])
  queryGroups() {
    return this.prisma.sys_group.findMany()
  }

  //创建组
  @Mutation(() => SysGroupEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  async createGroup(
    @Args("name") name: string,
    @Args("base64") base64: string
  ) {
    const buffer = this.file.base64_to_buffer(base64)
    const entity = await this.prisma.sys_group.create({
      data: {
        name
      }
    })
    this.file.writeFile(this.service.getGroupAvatarPath(entity), buffer);
    return entity
  }

  /**
   * 修改组
   */
  @Mutation(() => SysGroupEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  async updateGroup(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("base64", { nullable: true }) base64?: string
  ) {
    const entity = await this.prisma.sys_group.update({
      where: {
        id
      },
      data: {
        name
      }
    })
    if (!entity) throw new ForbiddenError("404")
    if (base64) {
      const buffer = this.file.base64_to_buffer(base64)
      this.file.writeFile(this.service.getGroupAvatarPath(entity), buffer);
    }
    return entity
  }
  /**
   * 删除组
   */
  @Mutation(() => SysGroupEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  async deleteGroup(
    @Args("id", { type: () => Int }) id: number
  ) {
    if (await this.prisma.sys_test.count({
      where: {
        sys_groupId: id
      }
    }) !== 0) throw new ForbiddenError("数据有关联，无法删除")
    const entity = await this.prisma.sys_group.delete({
      where: {
        id
      }
    })
    if (!entity) throw new ForbiddenError("404")
    this.file.destoryDirOrFile(this.service.getGroupAvatarPath(entity))
    return entity
  }

  @Query(() => [SysTestEntity])
  queryTests(
    @Args("sys_groupId", { type: () => Int }) sys_groupId: number
  ) {
    return this.prisma.sys_test.findMany({
      where: {
        sys_groupId
      }
    })
  }

  //创建测试
  @Mutation(() => SysTestEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  async createTest(
    @Args("sys_groupId", { type: () => Int }) sys_groupId: number,
    @Args("name") name: string,
    @Args("base64") base64: string
  ) {
    const buffer = this.file.base64_to_buffer(base64)
    const entity = await this.prisma.sys_test.create({
      data: {
        sys_groupId,
        name
      }
    })
    this.file.writeFile(this.service.getTestAvatarPath(entity), buffer);
    return entity
  }

  // 修改测试
  @Mutation(() => SysTestEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  async updateTest(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("base64", { nullable: true }) base64?: string
  ) {
    const entity = await this.prisma.sys_test.update({
      where: {
        id
      },
      data: {
        name
      }
    })
    if (!entity) throw new ForbiddenError("404")
    if (base64) {
      const buffer = this.file.base64_to_buffer(base64)
      this.file.writeFile(this.service.getTestAvatarPath(entity), buffer);
    }
    return entity
  }


  // 删除测试
  @Mutation(() => SysTestEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  async deleteTest(
    @Args("id", { type: () => Int }) id: number
  ) {
    if (await this.prisma.sys_test_group.count({
      where: {
        sys_testId: id
      }
    }) !== 0) throw new ForbiddenError("数据有关联，无法删除")
    const entity = await this.prisma.sys_test.delete({
      where: {
        id
      }
    })
    if (!entity) throw new ForbiddenError("404")
    this.file.destoryDirOrFile(this.service.getTestAvatarPath(entity))
    return entity
  }

  // 创建测试组
  @Mutation(() => SysTestGroupEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  createTestGroup(
    @Args("sys_testId", { type: () => Int }) sys_testId: number,
    @Args("name") name: string,
    @Args("PDF", { nullable: true }) PDF?: string,
    @Args("PPT", { nullable: true }) PPT?: string,
    @Args("is_test", { nullable: true }) is_test?: boolean,
  ) {
    return this.prisma.sys_test_group.create({
      data: {
        sys_testId,
        name,
        PDF,
        PPT,
        is_test
      }
    })
  }

  // 修改测试组
  @Mutation(() => SysTestGroupEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  updateTestGroup(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("PDF", { nullable: true }) PDF?: string,
    @Args("PPT", { nullable: true }) PPT?: string,
    @Args("is_test", { nullable: true }) is_test?: boolean,
  ) {
    return this.prisma.sys_test_group.update({
      where: {
        id
      },
      data: {
        name,
        PDF,
        PPT,
        is_test
      }
    })
  }

  // 删除测试组
  @Mutation(() => SysTestGroupEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  deleteTestGroup(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_test_group.delete({
      where: {
        id
      }
    })
  }

  //模拟测试 章节
  @Query(() => [SysTestChapterEntity])
  queryTestChapter(
    @Args("sys_test_groupId", { nullable: true, type: () => Int }) sys_test_groupId: number
  ) {
    return this.prisma.sys_test_chapter.findMany({
      where: {
        sys_test_groupId
      }
    })
  }

  //创建模拟测试 章节
  @Mutation(() => SysTestChapterEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  createTestChapter(
    @Args("sys_test_groupId", { type: () => Int }) sys_test_groupId: number,
    @Args("name") name: string,
    @Args("order", { nullable: true, type: () => Int }) order?: number,
    @Args("desc", { nullable: true }) desc?: string,
  ) {
    return this.prisma.sys_test_chapter.create({
      data: {
        sys_test_groupId,
        name,
        order,
        desc
      }
    })
  }
  // 修改模拟测试 章节
  @Mutation(() => SysTestChapterEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  updateTestChapter(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("order", { nullable: true, type: () => Int }) order?: number,
    @Args("desc", { nullable: true }) desc?: string,
  ) {
    return this.prisma.sys_test_chapter.update({
      where: {
        id
      },
      data: {
        name,
        order,
        desc
      }
    })
  }
  // 删除模拟测试 章节
  @Mutation(() => SysTestChapterEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  deleteTestChapter(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_test_chapter.delete({
      where: {
        id
      }
    })
  }

  @Query(() => [SysTestQuestionEntity])
  queryTestQuestion(
    @Args("sys_test_chapterId", { type: () => Int }) sys_test_chapterId: number
  ) {
    return this.prisma.sys_test_question.findMany({
      where: {
        sys_test_chapterId
      }
    })
  }

  //创建题目
  @Mutation(() => SysTestQuestionEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  createTestQuestion(
    @Args("title") title: string,
    @Args("answer") answer: string,
    @Args("type", { type: () => String }) type: sys_test_type,
    @Args("context") context: string,
    @Args("sys_test_chapterId", { type: () => Int }) sys_test_chapterId: number,
    @Args("order", { nullable: true, type: () => Int }) order?: number,
  ) {
    return this.prisma.sys_test_question.create({
      data: {
        sys_test_chapterId,
        title,
        answer,
        type,
        context,
        order
      }
    })
  }
  //修改题目
  @Mutation(() => SysTestQuestionEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  updateTestQuestion(
    @Args("id", { type: () => Int }) id: number,
    @Args("title") title: string,
    @Args("answer") answer: string,
    @Args("type", { type: () => String }) type: sys_test_type,
    @Args("context") context: string,
    @Args("sys_test_chapterId", { type: () => Int }) sys_test_chapterId: number,
    @Args("order", { nullable: true, type: () => Int }) order?: number,
  ) {
    return this.prisma.sys_test_question.update({
      where: {
        id
      },
      data: {
        sys_test_chapterId,
        title,
        answer,
        type,
        context,
        order
      }
    })
  }
  //删除题目
  @Mutation(() => SysTestQuestionEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  deleteTestQuestion(
    @Args("id", { type: () => Int }) id: number
  ) {
    return this.prisma.sys_test_question.delete({
      where: {
        id
      }
    })
  }

  //考试
  // @Mutation(() => SysTestPaperEntit`y)
  // @UseGuards(GqlAuthGuard)
  // async test_paper(

  // ) { }









}
