import { Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { OutlineService } from './outline.service';
import { FileService } from '@app/file';
import { PrismaService } from '@app/prisma';
import { Response } from 'express';

@Controller('outline')
@ApiTags("知识大纲")
export class OutlineController {
  constructor(
    private readonly service: OutlineService,
    private readonly file: FileService,
    private readonly prisma: PrismaService
  ) { }

  @Post("/:id/upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @Param("id") id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    id *= 1
    const entity = await this.prisma.sys_outline.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException()

    const buffer = file.buffer
    this.file.writeFile(this.service.getOutlineFilePath(entity), buffer)
  }

  @Get("/:id/download")
  async download(
    @Param("id") id: number,
    @Res() res: Response
  ) {
    id *= 1
    const entity = await this.prisma.sys_outline.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException()
    const buffer = this.file.readFile(this.service.getOutlineFilePath(entity))
    if (!buffer) throw new NotFoundException()
    res.set({
      'Content-Type': 'application/pdf', // 指定为 PDF 文件类型
      'Content-Disposition': 'inline', // 浏览器内嵌显示
      'Content-Length': buffer.length, // 内容长度
    });
    res.send(buffer);
  }
}
