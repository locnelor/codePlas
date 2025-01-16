import { useQuery } from "@apollo/client";
import { useLocation, useParams, useSearchParams } from "react-router"
import { GetNoticesQuery, GetNoticesResult } from "../admin/notices/page";
import NoticeLayout from "../../components/NoticeLayout";
import { hrefSet } from "../Header";



const NoticePage = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const pathname = useLocation().pathname
  const noticeQuery = useQuery<GetNoticesResult>(GetNoticesQuery, {
    variables: {
      page: 1,
      size: 1000000,
      type: type?.toUpperCase()
    }
  })
  const list = noticeQuery.data?.getNotices.data || []
  const find = !!id ? list.find(e => e.id === parseInt(id)) : list[0]
  const item = find || list[0];

  if (!item) return;
  return (
    <NoticeLayout
      title={hrefSet[pathname]}
      item={item}
      list={list}
      type={type}
    />
  )
}
export default NoticePage