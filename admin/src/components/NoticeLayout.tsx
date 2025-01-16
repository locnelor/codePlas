import dayjs from "dayjs"
import { NoticeEntity } from "../queries/notices"
import LineDivider from "./LineDivider"
import { EyeOutlined } from "@ant-design/icons"
import { Link } from "react-router"
import { useLazyQuery } from "@apollo/client"
import { GetNoticeByIdQuery, GetNoticeByIdResult } from "../pages/admin/notices/action/page"
import { useEffect } from "react"




type NoticeLayoutProps = {
  title: string,
  item: NoticeEntity,
  list: NoticeEntity[],
  type?: string
}
const NoticeLayout = ({
  title,
  item,
  list,
  type
}: NoticeLayoutProps) => {
  const [refetch, query] = useLazyQuery<GetNoticeByIdResult>(GetNoticeByIdQuery)
  useEffect(() => {
    refetch({
      variables: {
        id: item.id
      }
    })
  }, [item])
  const entity = query.data?.getNoticeById

  return (
    <div className="flex gap-2">
      <div className="grow">
        <div className="text-center text-2xl">
          {entity?.title}
        </div>
        <div className="flex text-red-400 justify-center gap-2">
          <div>
            {dayjs(entity?.createAt).format("YYYY-MM-DD")}
          </div>
          <div>
            •
          </div>
          <div className="flex gap-1">
            <EyeOutlined />
            <div>
              {entity?.view || 0 > 10000 ? `${entity?.view || 0 / 10000}万` : entity?.view}
            </div>
          </div>
        </div>
        <LineDivider />
        <div
          dangerouslySetInnerHTML={{
            __html: entity?.context + ""
          }}
        ></div>
      </div>
      <div className="w-60">
        <div>{title}</div>
        <LineDivider />
        {list.map((item) => {
          return (
            <div>
              <div className="">
                <Link to={`/${type}/notice?id=${item.id}`} className="text-blue-400">
                  {item.title}
                </Link>
              </div>
              <div className="text-right text-sm text-gray-600">
                {dayjs(item.createAt).format("YYYY-MM-DD")}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default NoticeLayout