"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import useViewer from "@/hooks/viewer/useViewer";

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
const HomePage = () => {
  // const { viewer } = useViewer()
  const list1 = [
    { title: "增加NOC题库（全国中小学信息技术创新与实践大赛）", time: "2024-04-30" },
    { title: "Windows客户端更新 V1.0.5.0，C++程序评分", time: "2024-04-24" },
    { title: "机构账号上线进行测试", time: "2023-09-21" },
    { title: "完善题库积分奖励", time: "2023-08-31" },
    { title: "GESP计算机基础知识", time: "2023-08-26" }
  ]
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
          list1.map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src="/images/icons/icon_leaf.png"
                href="/siteNotice"
                time={item.time}
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
          list1.map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src="/images/icons/icon_art.png"
                href="/testInfo"
                time={item.time}
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
      {/* <Title
        title="知识大纲"
        href="/news"
        src="/images/icons/icon_class.png"
      /> */}

    </div>
  );
};

export default HomePage;