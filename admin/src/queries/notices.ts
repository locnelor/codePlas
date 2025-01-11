import { BaseEntity } from "./base";
import { UserEntity } from "./user";

export const NoticeFields = `
view
title
sys_userId
context
type
`
export interface NoticeEntity extends BaseEntity {
  view: number
  title: string
  sys_userId: number
  context: string
  type: string
  creator?: UserEntity
}