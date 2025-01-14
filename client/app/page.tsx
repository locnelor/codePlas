import { getQuery } from "@/lib/client";
import { PaginationFields, BaseFields, BasePagination } from "@/queries/base";
import { NoticeFields, NoticeEntity } from "@/queries/notices";
import { UserFields } from "@/queries/user";
import { gql } from "@apollo/client";

import Image from "next/image";
import Link from "next/link";
type TitleProps = {
  title: string,
  href: string,
  src: string
}
const Title = ({
  title,
  href,
  src
}: TitleProps) => {
  return (
    <div className="flex gap-2 mt-2">
      <div className="w-14">
        <Image
          src={src}
          width={30}
          height={24}
          alt={title}
        />
      </div>
      <div className="grow">
        <Link href={href} className="text-blue-400">
          {title}
        </Link>
      </div>
      <div className="w-32">
        <Link href={href} className="text-blue-400">
          查看更多...
        </Link>
      </div>
    </div>
  )
}
type ListLineProps = {
  title: string,
  src: string,
  href: string,
  time: string,
  width?: number,
  height?: number
}
const ListLine = ({
  title,
  src,
  href,
  time,
  width = 30,
  height = 24
}: ListLineProps) => {
  return (
    <div className="flex gap-2">
      <div className="w-14 flex justify-center">
        <Image
          src={src}
          width={width}
          height={height}
          alt={title}
        />
      </div>
      <div className="grow">
        <Link href={href} className="text-blue-400">
          {title}
        </Link>
      </div>
      <div className="w-32">
        {time}
      </div>
    </div>
  )
}
const Divider = () => {
  return (
    <div className="h-1 border-t border-b border-blue-600 my-1"></div>
  )
}
[{
  value: "WEBSITE",
  label: "站务公告"
}, {
  value: "TEST_INFO",
  label: "考试信息"
}, {
  value: "DYNAMIC",
  label: "行业动态"
}, {
  value: "EXPERIENCE",
  label: "经验交流"
}]
//获取公告
export const GetNoticesQuery = gql`
  query GetNotices(
    $page: Int!,
    $size: Int!,
    $id: Int,
    $title: String,
    $type: String,
    $orderBy:String
  ){
    getNotices(
      page: $page,
      size: $size,
      id: $id,
      title: $title,
      orderBy:$orderBy,
      type: $type
    ){
      ${PaginationFields}
      data{
        ${BaseFields}
        ${NoticeFields}
        creator{
          ${UserFields}
          ${BaseFields}
        }
      }
    }
  }
`
export interface GetNoticesResult {
  getNotices: BasePagination<NoticeEntity>
}
const HomePage = async () => {
  const [WEBSITE] = await getQuery<GetNoticesResult>({
    query: GetNoticesQuery,
    variables: {
      page: 1,
      size: 5,
      type: "WEBSITE",
    }
  })
  const [TEST_INFO] = await getQuery<GetNoticesResult>({
    query: GetNoticesQuery,
    variables: {
      page: 1,
      size: 5,
      type: "TEST_INFO",
    }
  })
  const [DYNAMIC] = await getQuery<GetNoticesResult>({
    query: GetNoticesQuery,
    variables: {
      page: 1,
      size: 5,
      type: "DYNAMIC",
    }
  })
  const [EXPERIENCE] = await getQuery<GetNoticesResult>({
    query: GetNoticesQuery,
    variables: {
      page: 1,
      size: 5,
      type: "EXPERIENCE",
    }
  })

  return (
    <div>
      <Title
        title="站务公告"
        href="/siteNotice"
        src="/images/icons/icon_site.png"
      />
      <Divider />
      <div className="flex flex-col gap-2">
        {
          WEBSITE.getNotices.data.map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src="/images/icons/icon_leaf.png"
                href="/siteNotice"
                time={item.createAt.toString()}
              />
            )
          })
        }
      </div>
      <Title
        title="考试信息"
        href="/testInfo"
        src="/images/icons/icon_test.png"
      />
      <Divider />
      <div className="flex flex-col gap-2">
        {
          TEST_INFO.getNotices.data.map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src="/images/icons/icon_art.png"
                href="/testInfo"
                time={item.createAt.toString()}
              />
            )
          })
        }
      </div>

      <Title
        title="模拟测试"
        href="/robotBank"
        src="/images/icons/icon_paper.png"
      />
      <Divider />
      <div className="grid gap-5 grid-cols-4">
        {new Array(10).fill(0).map((_, index) => {
          return (
            <div key={index}>
              <Image
                src="/images/class/class_robot.png"
                alt="机器人"
                width={194}
                height={109}
              />
              <div className="text-center">
                <Link href="/robotBank" className="text-blue-400">
                  机器人技术模拟测试
                </Link>
              </div>
            </div>
          )
        })}
      </div>



      <Title
        title="行业动态"
        href="/news"
        src="/images/icons/icon_news.png"
      />
      <Divider />
      <div className="flex flex-col gap-2">
        {
          DYNAMIC.getNotices.data.map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src="/images/icons/icon_art.png"
                href="/testInfo"
                time={item.createAt.toString()}
              />
            )
          })
        }
      </div>
      <Title
        title="经验交流"
        href="/news"
        src="/images/icons/icon_class.png"
      />
       <div className="flex flex-col gap-2">
        {
          EXPERIENCE.getNotices.data.map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src="/images/icons/icon_art.png"
                href="/testInfo"
                time={item.createAt.toString()}
              />
            )
          })
        }
      </div>
    </div>
  );
};

export default HomePage;