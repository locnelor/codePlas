import { FileService } from '@app/file';
import { SysOutlineEntity } from '@app/prisma/sys.outline.entity/sys.outline.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutlineService {
  constructor(
    private readonly file: FileService
  ) { }

  public outlineRoot = this.file.make("outline")
  public getOutlineFilePath(entity: SysOutlineEntity) {
    return this.file.join(this.outlineRoot, `${entity.id}.pdf`)
  }
}
