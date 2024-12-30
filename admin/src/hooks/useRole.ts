import { useCallback, useMemo } from "react";
import useViewer from "./useViewer"

export const VIEW_POWER = 1;//查询权限
export const CREATE_POWER = 1 << 1;//编辑权限
export const UPDATE_POWER = 1 << 2;//删除权限
export const DELETE_POWER = 1 << 3;//增加权限
export const EXPORT_POWER = 1 << 4;//导出权限
export const IMPOER_POWER = 1 << 5;//导入权限
export const ASSIGN_POWER = 1 << 6;//分配权限
export const PowerArray = ["查询", "编辑", "删除", "新增", "导出"]

export type HasPowerHandler = (power: number[]) => boolean;
const useRole = (path: string) => {
  const { user } = useViewer();
  const roles = useMemo(() => user?.role?.sys_menu_on_role || [], [user]);
  const find = useMemo(() => {
    return roles.find((e) => {
      return e.menu?.path === path;
    })
  }, [roles]);
  const rolePower = useMemo(() => find?.menu?.role || 0, [find]);
  const hasPower = useCallback((power: number[]) => {
    const powerNum = power.reduce((acc, item) => acc | item, 0);
    return (rolePower & powerNum) === powerNum;
  }, [rolePower])
  return hasPower
}
export default useRole