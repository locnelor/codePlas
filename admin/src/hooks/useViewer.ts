import { gql, useQuery } from "@apollo/client"
import { BaseFields } from "../queries/base"
import { UserEntity, UserFields } from "../queries/user"
import { RoleFields } from "../queries/role"
import { MenuOnRoleFields } from "../queries/on"
import { MenuFields } from "../queries/menu"


export const ViewerQuery = gql`
  query ViewerQuery{
    viewer{
      ${BaseFields}
      ${UserFields}
      role{
        ${RoleFields}
        sys_menu_on_role{
          ${MenuOnRoleFields}
          menu{
            ${MenuFields}
          }
        }
      }
    }
  }
`
export type ViewerQueryResult = {
  viewer: UserEntity
}
const useViewer = () => {
  const { data, loading, error } = useQuery<{
    viewer: UserEntity
  }>(ViewerQuery)
  const user = data?.viewer
  return { user, loading, error }
}
export default useViewer