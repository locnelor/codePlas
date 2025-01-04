import { FileService } from '@app/file';
import { SysSoftwarePlatformEntity } from '@app/prisma/sys.software.platform.entity/sys.software.platform.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SoftwareService {
  constructor(
    private readonly file: FileService
  ) { }
  public avatarRoot = this.file.make("software")
  getAvatarDir(entity: SysSoftwarePlatformEntity) {
    return this.file.join(this.avatarRoot, entity.id.toString())
  }
  getAvatarPath(entity: SysSoftwarePlatformEntity) {
    return this.file.join(this.getAvatarDir(entity), "image.png")
  }

}
