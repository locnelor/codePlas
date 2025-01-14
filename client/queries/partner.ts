import { BaseEntity } from "./base";


export const PartnerFields = `
name
order
`
export interface PartnerEntity extends BaseEntity {
  name: string
  order: number
}