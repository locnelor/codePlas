import { FileService } from '@app/file';
import { PrismaService } from '@app/prisma';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { SoftwareService } from 'src/software/software.service';
import { TestService } from 'src/test/test.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly software: SoftwareService,
    private readonly prisma: PrismaService,
    private readonly file: FileService,
    private readonly test: TestService
  ) { }

  @Get("software/:id/cover")
  async getSoftwareCover(
    @Param("id") id: number,
    @Res() res: Response
  ) {
    id *= 1;
    const entity = await this.prisma.sys_software_platform.findUnique({ where: { id } })
    if (!entity) throw new NotFoundException()
    res.sendFile(this.software.getAvatarPath(entity))
  }

  @Get("group/:id/cover")
  async getGroupCover(
    @Param("id") id: number,
    @Res() res: Response
  ) {
    id *= 1;
    const entity = await this.prisma.sys_test_group.findUnique({ where: { id } })
    if (!entity) throw new NotFoundException()
    res.sendFile(this.test.getGroupAvatarPath(entity))
  }

  @Get("test/:id/cover")
  async getTestCover(
    @Param("id") id: number,
    @Res() res: Response
  ) {
    id *= 1;
    const entity = await this.prisma.sys_test.findUnique({ where: { id } })
    if (!entity) throw new NotFoundException()
    res.sendFile(this.test.getTestAvatarPath(entity))
  } 
}
