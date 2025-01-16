import { useQuery } from "@apollo/client"
import LineDivider from "../../components/LineDivider"
import { QuerySoftwareQuery, QuerySoftwareResult } from "../admin/software/page"
import { joinPath } from "../../libs/http-fetch"

const SoftwarePage = () => {
  const { data } = useQuery<QuerySoftwareResult>(QuerySoftwareQuery)
  const dataSource = data?.querySoftware || []
  return (
    <div>
      <div className="text-center text-2xl">软件下载</div>
      <LineDivider />
      {dataSource.map((item) => {
        return (
          <div className="my-1 flex gap-2 items-center border border-dashed">
            <div className="border-r border-dashed">
              <img
                src={joinPath(`/media/software/${item.id}/cover`)}
                className="max-w-24"
              />
            </div>
            <div className="w-32 text-center border-r border-dashed h-full">{item.title}</div>
            <div className="grow">{item.description}</div>
          </div>
        )
      })}
    </div>
  )
}
export default SoftwarePage