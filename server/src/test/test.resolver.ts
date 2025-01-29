import { FileService } from "@app/file";
import { PrismaService } from "@app/prisma";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CREATE_POWER, DELETE_POWER, MakeGqlAuthPowerGuard, UPDATE_POWER } from "src/auth/auth.guard";
import { TestService } from "./test.service";
import { SysTestGroupEntity } from "@app/prisma/sys.test.group.entity/sys.test.group.entity";
import { UseGuards } from "@nestjs/common";
import { ForbiddenError } from "@nestjs/apollo";
import { SysTestEntity } from "@app/prisma/sys.test.entity/sys.test.entity";
import { SysTestChapterEntity } from "@app/prisma/sys.test.chapter.entity/sys.test.chapter.entity";
import { SysTestPaperEntity } from "@app/prisma/sys.test.paper.entity/sys.test.paper.entity";

export const TestGuard = MakeGqlAuthPowerGuard("/test", "模拟测试")
@Resolver()
export class TestResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
    private readonly service: TestService
  ) { }

  //模拟测试组
  @Query(() => [SysTestGroupEntity])
  queryTestGroups() {
    return this.prisma.sys_test_group.findMany()
  }

  @Mutation(() => SysTestGroupEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  async createTestGroup(
    @Args("name") name: string,
    @Args("base64") base64: string,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
  ) {
    const buffer = this.file.base64_to_buffer(base64)
    const entity = await this.prisma.sys_test_group.create({
      data: {
        name,
        desc,
        order,
        status
      }
    })
    this.file.writeFile(this.service.getGroupAvatarPath(entity), buffer);
    return entity
  }
  @Mutation(() => SysTestGroupEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  async updateTestGroup(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("base64", { nullable: true }) base64?: string,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
  ) {
    const entity = await this.prisma.sys_test_group.update({
      where: {
        id
      },
      data: {
        name,
        desc,
        order,
        status
      }
    })
    if (!entity) throw new ForbiddenError("404")
    if (!!base64) {
      const buffer = this.file.base64_to_buffer(base64)
      this.file.writeFile(this.service.getGroupAvatarPath(entity), buffer);
    }
    return entity
  }
  @Mutation(() => SysTestGroupEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  async deleteTestGroup(
    @Args("id", { type: () => Int }) id: number,
  ) {
    const entity = await this.prisma.sys_test_group.delete({
      where: {
        id
      }
    })
    if (!entity) throw new ForbiddenError("404")
    return entity
  }


  //模拟测试
  @Query(() => [SysTestEntity])
  queryTests() {
    return this.prisma.sys_test.findMany()
  }
  @Mutation(() => SysTestEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  async createTest(
    @Args("name") name: string,
    @Args("base64") base64: string,
    @Args("sys_test_groupId", { type: () => Int }) sys_test_groupId: number,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
  ) {
    const buffer = this.file.base64_to_buffer(base64)
    const entity = await this.prisma.sys_test.create({
      data: {
        name,
        desc,
        order,
        status,
        sys_test_groupId
      }
    })
    this.file.writeFile(this.service.getTestAvatarPath(entity), buffer);
    return entity
  }

  @Mutation(() => SysTestEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  async updateTest(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("sys_test_groupId", { type: () => Int }) sys_test_groupId: number,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
    @Args("base64", { nullable: true }) base64?: string,
  ) {
    const entity = await this.prisma.sys_test.update({
      where: {
        id
      },
      data: {
        name,
        desc,
        order,
        status,
        sys_test_groupId
      }
    })
    if (!entity) throw new ForbiddenError("404")
    if (base64) {
      const buffer = this.file.base64_to_buffer(base64)
      this.file.writeFile(this.service.getTestAvatarPath(entity), buffer);
    }
    return entity
  }

  @Mutation(() => SysTestEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  async deleteTest(
    @Args("id", { type: () => Int }) id: number,
  ) {
    const entity = await this.prisma.sys_test.delete({
      where: {
        id
      }
    })
    if (!entity) throw new ForbiddenError("404")
    return entity
  }

  //模拟测试章节
  @Query(() => [SysTestChapterEntity])
  queryTestChapters() {
    return this.prisma.sys_test_chapter.findMany()
  }
  @Mutation(() => SysTestChapterEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  async createTestChapter(
    @Args("name") name: string,
    @Args("sys_testId", { type: () => Int }) sys_testId: number,
    @Args("money", { type: () => Int }) money: number,
    @Args("is_test", { type: () => Boolean }) is_test: boolean,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
    @Args("PPT", { nullable: true }) PPT?: string,
    @Args("PDF", { nullable: true }) PDF?: string,
    @Args("video", { nullable: true }) video?: string,
    @Args("one2one", { nullable: true }) one2one?: string,
    @Args("outline", { nullable: true }) outline?: string,
  ) {
    const entity = await this.prisma.sys_test_chapter.create({
      data: {
        name,
        desc,
        order,
        status,
        sys_testId,
        PPT,
        PDF,
        video,
        one2one,
        outline,
        money,
        is_test
      }
    })
    return entity
  }

  @Mutation(() => SysTestChapterEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  async updateTestChapter(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("money", { type: () => Int }) money: number,
    @Args("is_test", { type: () => Boolean }) is_test: boolean,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
    @Args("PPT", { nullable: true }) PPT?: string,
    @Args("PDF", { nullable: true }) PDF?: string,
    @Args("video", { nullable: true }) video?: string,
    @Args("one2one", { nullable: true }) one2one?: string,
    @Args("outline", { nullable: true }) outline?: string,
  ) {
    const entity = await this.prisma.sys_test_chapter.update({
      where: {
        id
      },
      data: {
        name,
        desc,
        order,
        status,
        PPT,
        PDF,
        video,
        one2one,
        outline,
        money,
        is_test
      }
    })
    if (!entity) throw new ForbiddenError("404")
    return entity
  }

  @Mutation(() => SysTestChapterEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  async deleteTestChapter(
    @Args("id", { type: () => Int }) id: number,
  ) {
    const entity = await this.prisma.sys_test_chapter.delete({
      where: {
        id
      }
    })
    if (!entity) throw new ForbiddenError("404")
    return entity
  }

  @Query(() => [SysTestPaperEntity])
  queryTestPapers() {
    return this.prisma.sys_test_paper.findMany()
  }

  @Mutation(() => SysTestPaperEntity)
  @UseGuards(TestGuard([CREATE_POWER]))
  async createTestPaper(
    @Args("name") name: string,
    @Args("sys_test_chapterId", { type: () => Int }) sys_test_chapterId: number,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
    @Args("is_free", { nullable: true }) is_free?: boolean,
  ) {
    const entity = await this.prisma.sys_test_paper.create({
      data: {
        name,
        desc,
        order,
        status,
        sys_test_chapterId,
        is_free
      }
    })
    return entity
  }

  @Mutation(() => SysTestPaperEntity)
  @UseGuards(TestGuard([UPDATE_POWER]))
  async updateTestPaper(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("desc", { nullable: true }) desc?: string,
    @Args("order", { nullable: true }) order?: number,
    @Args("status", { nullable: true }) status?: boolean,
    @Args("is_free", { nullable: true }) is_free?: boolean,
  ) {
    const entity = await this.prisma.sys_test_paper.update({
      where: {
        id
      },
      data: {
        name,
        desc,
        order,
        status,
        is_free
      }
    })
    if (!entity) throw new ForbiddenError("404")
    return entity
  }

  @Mutation(() => SysTestPaperEntity)
  @UseGuards(TestGuard([DELETE_POWER]))
  async deleteTestPaper(
    @Args("id", { type: () => Int }) id: number,
  ) {
    const entity = await this.prisma.sys_test_paper.delete({
      where: {
        id
      }
    })
    if (!entity) throw new ForbiddenError("404")
    return entity
  }
}