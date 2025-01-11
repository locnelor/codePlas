import { PrismaService } from '@app/prisma';
import { SysPartnerEntity } from '@app/prisma/sys.partner.entity/sys.partner.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CREATE_POWER, DELETE_POWER, MakeGqlAuthPowerGuard, UPDATE_POWER } from 'src/auth/auth.guard';

const PartnerGuard = MakeGqlAuthPowerGuard("/partner", "合作伙伴")
@Resolver()
export class PartnerResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @Query(() => [SysPartnerEntity])
  queryPartner() {
    return this.prisma.sys_partner.findMany()
  }

  @Mutation(() => SysPartnerEntity)
  @UseGuards(PartnerGuard([CREATE_POWER]))
  createPartner(
    @Args("name") name: string,
    @Args("order", { type: () => Int }) order: number
  ) {
    return this.prisma.sys_partner.create({
      data: {
        name,
        order
      }
    })
  }

  @Mutation(() => SysPartnerEntity)
  @UseGuards(PartnerGuard([UPDATE_POWER]))
  updatePartner(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("order", { type: () => Int }) order: number
  ) {
    return this.prisma.sys_partner.update({
      where: {
        id
      },
      data: {
        name,
        order
      }
    })
  }

  @Mutation(() => Int)
  @UseGuards(PartnerGuard([DELETE_POWER]))
  async deletePartner(
    @Args("ids", { type: () => [Int] }) ids: number[]
  ) {
    const { count } = await this.prisma.sys_partner.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    return count
  }
}
