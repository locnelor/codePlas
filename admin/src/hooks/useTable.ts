import { useMemo } from "react";
import { PowerEditTableColumn } from "../components/PowerEditTable";


export const useColumns = (columns: PowerEditTableColumn[], id = "id") => {
  const result = useMemo(() => {
    if (!columns) return [];
    return columns.map((item: any, key) => ({
      ...item,
      key: item[id] || key,
    }))
  }, [columns])
  return result;
}

export const useDataSource = <T>(data?: T[], id = "id") => {
  const result = useMemo(() => {
    if (!data) return [];
    return data.map((item: any, key) => ({
      ...item,
      key: item[id] || key
    }))
  }, [data])
  return result;
}