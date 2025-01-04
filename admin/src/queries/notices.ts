import { BaseEntity } from "./base";
import { UserEntity } from "./user";

export const NoticeFields = `
view
title
sys_userId
context
`
export interface NoticeEntity extends BaseEntity {
  view: number
  title: string
  sys_userId: number
  context: string
  creator?: UserEntity
}