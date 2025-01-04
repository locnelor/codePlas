import { Module } from '@nestjs/common';
import { PartnerResolver } from './partner.resolver';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [PartnerResolver]
})
export class PartnerModule { }
