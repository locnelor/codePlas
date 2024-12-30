import { useLazyQuery } from "@apollo/client"
import { DocumentNode } from "graphql"
import { useCallback, useEffect, useMemo, useState } from "react"
import { BasePagination } from "../queries/base"
import { Pagination } from "antd"



type UsePaginationOptions = {
  variables?: any
}
function usePagination<T extends BasePagination>(
  query: DocumentNode,
  {
    variables
  }: UsePaginationOptions = {}
) {
  const [getData, dataQuery] = useLazyQuery<T>(query)
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (dataQuery.loading) return;
    if (!!dataQuery.error) return;
    if (!dataQuery.data) return;
    setPage(dataQuery.data.page)
    setSize(dataQuery.data.size)
    setTotal(dataQuery.data.total);
  }, [dataQuery])
  const refetch = useCallback((variables = {}, p = page, s = size) => {
    getData({
      variables: {
        page: p,
        size: s,
        ...variables
      }
    })
  }, [page, size])
  const pagination = useMemo(() => {
    return (
      <Pagination
        pageSize={size}
        current={page}
        total={total}
        onChange={(p, s) => {
          refetch(variables, p, s)
        }}
      />
    )
  }, [page, size, total, variables])
  return {
    refetch,
    total,
    page,
    size,
    pagination
  }
}
export default usePagination