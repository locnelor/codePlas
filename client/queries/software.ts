import { BaseEntity } from "./base";

export const SoftwareFields = `
title
href
description
`
export interface SoftwareEntity extends BaseEntity {
  title: string;
  href: string;
  description: string;
}