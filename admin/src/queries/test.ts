import { BaseEntity } from "./base";
export const GroupFields = `
name
`
export interface GroupEntity extends BaseEntity {
  name: string
}
export const TestFields = `
name
sys_groupId
`
export interface TestEntity extends BaseEntity {
  name: string
  sys_groupId: number
  sources?: TestSourceEntity[]
  sys_test_group?: TestGroupEntity[]
}

export const TestGroupFields = `
name
order
sys_testId
`
export interface TestGroupEntity extends BaseEntity {
  name: string
  order: number
  sys_testId: number
}

export const TestChapterFields = `
name
desc
order
sys_test_groupId
`
export interface TestChapterEntity extends BaseEntity {
  name: string
  desc: string
  order: number
  sys_test_groupId: number
  sys_test_group?: TestGroupEntity
  sys_test_question?: TestQuestionEntity[]
  sys_test_paper?: TestPaperEntity[]
}
export enum sys_test_type {
  SINGLE = "SINGLE", //单选
  MULTIPLE = "MULTIPLE", //多选
  JUDGE = "JUDGE" //判断
}

export const TestQuestionFields = `
title
answer
type
context
order
sys_test_chapterId
test_count
test_right_count
`
export interface TestQuestionEntity extends BaseEntity {
  title: string
  answer: string
  type: sys_test_type
  context: string
  order: number
  sys_test_chapterId: number
  sys_test_chapter?: TestChapterEntity
  sys_test_paper_on_question?: TestPaperOnQuestinEntity[]
}

export const TestSourceEntity = `
name
href
sys_testId
`
export interface TestSourceEntity extends BaseEntity {
  name: string
  href: string
  sys_testId: number
  sys_test?: TestEntity
}

export const TestPaperFields = `
sys_userId
sys_test_chapterId
is_end
correct
wrong
un_answer
score
`
export interface TestPaperEntity extends BaseEntity {
  sys_userId: number
  sys_test_chapterId: number
  is_end: number
  correct: number
  wrong: number
  un_answer: number
  score: number
  sys_test_paper_question?: TestPaperQuestionEntity[]
}

export const TestPaperOnQuestionFields = `
sys_test_paper_questionId
sys_test_questionId
`
export interface TestPaperOnQuestinEntity extends BaseEntity {
  sys_test_paper_questionId: number
  sys_test_questionId: number
  sys_test_paper_question?: TestPaperQuestionEntity
  sys_test_question?: TestQuestionEntity
}
export const TestPaperQuestionFields = `
sys_test_paperId
`
export interface TestPaperQuestionEntity extends BaseEntity {
  sys_test_paperId: number
  questions?: TestPaperOnQuestinEntity[]
  paper?: TestPaperEntity
}
export const TestChapterItemFields = `
name
desc
order
time
is_free
sys_test_chapterId
`
export interface TestChapterItemEntity extends BaseEntity {
  name: string
  desc: string
  order: number
  time: number
  is_free: number
  sys_test_chapterId: number
  chapter?: TestChapterEntity
  sys_test_question?: TestQuestionEntity[]
}