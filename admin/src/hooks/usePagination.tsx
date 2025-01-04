import { useLazyQuery } from "@apollo/client"
import { DocumentNode } from "graphql"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { BasePagination } from "../queries/base"
import { Pagination } from "antd"
import { VariablesObject } from "../type"

type UsePaginationProps<NAME> = {
  query: DocumentNode,
  name: NAME,
  showTotal?: (total: number, range: [number, number]) => ReactNode
}
function usePagination<T, NAME extends string = any>({
  query,
  name,
  showTotal = (total) => <div>共{total}条</div>
}: UsePaginationProps<NAME>) {
  const [getData, dataQuery] = useLazyQuery<Record<NAME, BasePagination<T>>>(query)
  const [variables, setVariables] = useState<VariablesObject>({})
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const queryData = useCallback((variables: VariablesObject, p = page, s = size) => {
    getData({
      variables: {
        ...variables,
        page: p,
        size: s
      },
      fetchPolicy: "network-only"
    })
    setVariables(variables)
    setPage(page)
    setSize(size)
  }, [variables, page, size])
  const research = useCallback((variables: VariablesObject, page: number = 1, size: number = 10) => {
    queryData(variables, page, size)
  }, [page, size])
  const refetch = useCallback(() => {
    queryData(variables, page, size)
  }, [queryData, variables, page, size])
  const onPage = useCallback((page: number, size: number) => {
    queryData(variables, page, size);
  }, [variables])
  const result = useMemo(() => ({
    page,
    size,
    total: 0,
    loading: dataQuery.loading,
    data: [],
    ...dataQuery.data?.[name]
  }), [dataQuery.data])
  const pagination = useMemo(() => {
    return <Pagination
      pageSize={result.size}
      current={result.page}
      total={result.page}
      showTotal={showTotal}
      onChange={onPage}
    />
  }, [result, onPage])
  console.log(dataQuery.data?.[name], name)
  return {
    refetch,
    research,
    pagination,
    ...result
  }
}
export default usePagination