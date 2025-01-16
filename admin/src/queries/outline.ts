import { BaseEntity } from "./base";

export const OutlineFields = `
name
order
status
comment
`
export interface OutlineEntity extends BaseEntity {
  name: string;
  order: number;
  status: boolean;
  comment: string;
}