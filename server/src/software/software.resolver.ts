import { PrismaService } from '@app/prisma';
import { SysSoftwarePlatformEntity } from '@app/prisma/sys.software.platform.entity/sys.software.platform.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, MakeGqlAuthPowerGuard, UPDATE_POWER } from 'src/auth/auth.guard';
import { SoftwareService } from './software.service';
import { FileService } from '@app/file';
import { ForbiddenError } from '@nestjs/apollo';


const SoftwareGuard = MakeGqlAuthPowerGuard("/software", "软件平台")
@Resolver()
export class SoftwareResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: SoftwareService,
    private readonly file: FileService
  ) { }

  @Query(() => [SysSoftwarePlatformEntity])
  querySoftware() {
    return this.prisma.sys_software_platform.findMany()
  }

  @Mutation(() => SysSoftwarePlatformEntity)
  @UseGuards(SoftwareGuard([CREATE_POWER]))
  async createSoftware(
    @Args("base64") base64: string,
    @Args("title") title: string,
    @Args("href") href: string,
    @Args("description") description: string
  ) {
    const buffer = this.file.base64_to_buffer(base64)
    const entity = await this.prisma.sys_software_platform.create({
      data: {
        title,
        href,
        description
      }
    })
    this.file.writeFile(this.service.getAvatarPath(entity), buffer);
    return entity;
  }

  @Mutation(() => SysSoftwarePlatformEntity)
  @UseGuards(SoftwareGuard([UPDATE_POWER]))
  async updateSoftware(
    @Args("id", { type: () => Int }) id: number,
    @Args("title") title: string,
    @Args("href") href: string,
    @Args("description") description: string,
    @Args("base64", { nullable: true }) base64?: string,
  ) {
    const entity = await this.prisma.sys_software_platform.update({
      where: {
        id
      },
      data: {
        title,
        description,
        href
      }
    })
    if (!entity) throw new ForbiddenError("404 not found")
    if (!!base64) {
      const buffer = this.file.base64_to_buffer(base64)
      this.file.writeFile(this.service.getAvatarPath(entity), buffer);
    }
    return entity;
  }

  @Mutation(() => Int)
  @UseGuards(SoftwareGuard([DELETE_POWER]))
  async deleteSoftware(
    @Args("ids", { type: () => [Int] }) ids: number[]
  ) {
    let count = 0;
    for (const id of ids) {
      const entity = await this.prisma.sys_software_platform.delete({
        where: {
          id
        }
      })
      if (!entity) continue;
      this.file.destoryDirOrFile(this.service.getAvatarDir(entity))
      count++;
    }
    return count;
  }
}
