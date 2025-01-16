import { useQuery } from "@apollo/client"
import { Link } from "react-router"
import { GetNoticesQuery, GetNoticesResult } from "./admin/notices/page"
import dayjs from "dayjs"
import { QueryOutlineQuery, QueryOutlineQueryResult } from "./admin/outline/page"
import { QuerySoftwareQuery, QuerySoftwareResult } from "./admin/software/page"
import { joinPath } from "../libs/http-fetch"
import LineDivider from "../components/LineDivider"

type TitleProps = {
  title: string,
  href?: string,
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
        <img src={src} width={30} height={24} alt={title} />
      </div>
      <div className="grow">
        {!!href && <Link to={href} className="text-blue-400">
          {title}
        </Link>}
        {!href && title}
      </div>
      {!!href && <div className="w-32">
        <Link to={href} className="text-blue-400">
          查看更多...
        </Link>
      </div>}
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
        <img
          src={src}
          style={{
            width,
            height
          }}
          alt={title}
        />
      </div>
      <div className="grow">
        <Link to={href} className="text-blue-400">
          {title}
        </Link>
      </div>
      <div className="w-32">
        {time}
      </div>
    </div>
  )
}
type NoticeItemProps = {
  type: string,
  page?: number,
  size?: number,
  title: string,
  href: string,
  src: string,
  icon: string,
  getHref?: (id: number) => string,
  width?: number,
  height?: number
}
const NoticeItem = ({
  type = "",
  page = 1,
  size = 5,
  title,
  href,
  src,
  icon,
  getHref = (src) => src.toString(),
  width = 30,
  height = 24
}: NoticeItemProps) => {
  const { data, loading } = useQuery<GetNoticesResult>(GetNoticesQuery, {
    variables: {
      type,
      page,
      size
    }
  })
  if (loading) return null;
  return (
    <>
      <Title
        title={title}
        href={href}
        src={src}
      />
      <LineDivider />
      <div className="flex flex-col gap-2">
        {
          (data?.getNotices.data || []).map((item, index) => {
            return (
              <ListLine
                key={index}
                title={item.title}
                src={icon}
                href={getHref(item.id)}
                time={dayjs(item.createAt).format("YYYY-MM-DD")}
                width={width}
                height={height}
              />
            )
          })
        }
      </div>
    </>
  )
}
const HomePage = () => {
  const outlineQuery = useQuery<QueryOutlineQueryResult>(QueryOutlineQuery)
  const softwareQuery = useQuery<QuerySoftwareResult>(QuerySoftwareQuery)
  return (
    <div>
      <NoticeItem
        type="WEBSITE"
        title="站务公告"
        href="/website/notice"
        src="/images/icons/icon_site.png"
        icon="/images/icons/icon_leaf.png"
        getHref={(id) => `/website/notice?id=${id}`}
      />
      <NoticeItem
        type="TEST_INFO"
        title="考试信息"
        href="/test_info/notice"
        src="/images/icons/icon_test.png"
        icon="/images/icons/icon_art.png"
        getHref={(id) => `/test_info/notice?id=${id}`}
      />
      <Title
        title="模拟测试"
        href="/robotBank"
        src="/images/icons/icon_paper.png"
      />
      <LineDivider />
      <div className="grid gap-5 grid-cols-4">
        {new Array(10).fill(0).map((_, index) => {
          return (
            <div key={index}>
              <img
                src="/images/class/class_robot.png"
                alt="机器人"
                width={194}
                height={109}
              />
              <div className="text-center">
                <Link to="/robotBank" className="text-blue-400">
                  机器人技术模拟测试
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      <NoticeItem
        type="DYNAMIC"
        title="行业动态"
        href="/dynamic/notice"
        src="/images/icons/icon_news.png"
        icon="/images/icons/icon_art.png"
        getHref={(id) => `/dynamic/notice?id=${id}`}
      />
      <Title
        title="知识大纲"
        src="/images/icons/icon_class.png"
      />
      <LineDivider />
      <div className="grid gap-5 grid-cols-2">
        {
          (outlineQuery.data?.queryOutline || []).map((item, index) => {
            return (
              <div key={index} className="flex gap-2 items-center">
                <img
                  src={`/images/icons/icon_point.png`}
                />
                <div className="text-center">
                  <Link target="_blank" to={joinPath(`outline/${item.id}/download`)} className="text-blue-400">
                    {item.name}
                  </Link>
                </div>
              </div>
            )
          })
        }
      </div>
      <NoticeItem
        type="EXPERIENCE"
        title="经验交流"
        href="/experience/notice"
        src="/images/icons/icon_show.png"
        icon="/images/icons/icon_art.png"
        getHref={(id) => `/experience/notice?id=${id}`}
      />
      <Title
        title="软件平台"
        src="/images/icons/icon_soft.png"
        href="/software"
      />
      <LineDivider />
      <div className="grid gap-5 grid-cols-4">
        {
          (softwareQuery.data?.querySoftware || []).slice(0, 5).map((item, index) => {
            return (
              <div key={index} className="flex flex-col gap-2 items-center">
                <img
                  src={joinPath(`/media/software/${item.id}/cover`)}
                  width={194}
                  height={109}
                />
                <div className="text-center">
                  <Link to={`/software/${item.id}`} className="text-blue-400">
                    {item.title}
                  </Link>
                </div>
              </div>
            )
          })
        }
      </div>


    </div>
  )
}
export default HomePage