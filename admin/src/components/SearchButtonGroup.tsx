import { SearchOutlined, ReloadOutlined } from "@ant-design/icons"
import { Space, Button } from "antd"


type SearchButtonGroupProps = {
  onSearch?: () => void,
  onReset?: () => void
}
const SearchButtonGroup = ({
  onSearch,
  onReset
}: SearchButtonGroupProps) => {

  return (
    <Space>
      {!!onSearch && <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>搜索</Button>}
      {!!onReset && <Button icon={<ReloadOutlined />} htmlType="reset" onClick={onReset}>重置</Button>}
    </Space>
  )
}
export default SearchButtonGroup