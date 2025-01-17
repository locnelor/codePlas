import { FileService } from '@app/file';
import { SysGroupEntity } from '@app/prisma/sys.group.entity/sys.group.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  constructor(
    private readonly file: FileService
  ) { }
  public GroupAvatarRoot = this.file.make("test_group")
  getGroupAvatarPath(entity: SysGroupEntity) {
    return this.file.join(this.GroupAvatarRoot, entity.id.toString() + ".png")
  }

  public TestAvatarRoot = this.file.make("test")
  getTestAvatarPath(entity: SysGroupEntity) {
    return this.file.join(this.TestAvatarRoot, entity.id.toString() + ".png")
  }

}
