import { useQuery } from "@apollo/client"
import { QueryPartnerQuery, QueryPArtnerResult } from "../admin/partner/page"
import LineDivider from "../../components/LineDivider"


const PartnerPage = () => {
  const { data } = useQuery<QueryPArtnerResult>(QueryPartnerQuery)
  const dataSource = data?.queryPartner || []
  return (
    <div>
      <div className="text-center text-2xl">合作机构名单（排名不分先后）</div>
      <LineDivider />
      <div className="m-10 border-l border-r border-b border-dashed">
        <div className="flex gap-2 border-t border-dashed">
          <div className="w-32 border-r border-dashed text-center">
            序号
          </div>
          <div className="grow">
            机构名称
          </div>
        </div>
        {dataSource.map((item, index) => {
          return (
            <div className="flex gap-2 border-t border-dashed" key={item.id}>
              <div className="w-32 border-r border-dashed text-center">
                {index + 1}
              </div>
              <div className="grow" style={{ color: "#008b8b" }}>
                {item.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default PartnerPage