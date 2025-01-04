import { FileService } from '@app/file';
import { SysNoticeEntity } from '@app/prisma/sys.notice.entity/sys.notice.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NoticeService {
  constructor(
    private readonly file: FileService
  ) { }
  public noticeRoot = this.file.make("notice")

  getNoticeDir(entity: SysNoticeEntity) {
    return this.file.join(this.noticeRoot, entity.id.toString())
  }
  getNoticePath(entity: SysNoticeEntity) {
    return this.file.join(this.getNoticeDir(entity), "context.json")
  }

}
