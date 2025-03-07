import { Button, Table, TableProps } from "antd"
import { CREATE_POWER, DELETE_POWER, HasPowerHandler, UPDATE_POWER } from "../hooks/useRole"
import { useCallback, useEffect, useMemo, useState } from "react"
import FormField, { FormFieldType } from "./FormField"
import { AnyObject } from "../type"
import { PlusOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { deepCopyObject } from "../libs/utils"
import DelPopover from "./DelPopover"

export type EditTableColumns = {
  title: string,
  dataIndex?: string | string[],
  type?: FormFieldType,
  render?: (text: any, record: any) => React.ReactNode
} & { [key in string]: any }
type EditTableProps<T> = Omit<TableProps, "columns" | "dataSource"> & {
  columns: EditTableColumns[],
  dataSource: T[],
  hasRole: HasPowerHandler,
  onChangeItem?: (record: T, edit: AnyObject) => void,
  onCreate?: () => void
  onDelete?: (ids: number[]) => void
}
function EditTable<T extends AnyObject>({
  columns,
  dataSource,
  hasRole,
  onChangeItem,
  onCreate,
  onDelete,
  ...rest
}: EditTableProps<T>) {
  const [current, setCurrent] = useState<T | null>(null);
  const [edit, setEdit] = useState<AnyObject>({});
  const tableColumns = useMemo(() => {
    return columns.map((item, key) => {
      return ({
        ...item,
        render: (text: any, record: any) => {
          if (!!item.render) return item.render(text, record)
          if (!item.dataIndex) return;
          if (hasRole([UPDATE_POWER]) && item.type) {
            let value = text;
            if (!!current && current.id === record.id) {
              if (typeof item.dataIndex === "string") {
                value = current[item.dataIndex]
              } else {
                value = item.dataIndex.reduce((pre, cur) => {
                  if (!pre) return null;
                  return pre[cur]
                }, current)
              }
            }
            const readOnly = (!!current ? current.id === record.id : true)
            return <FormField
              {...item}
              key={key}
              value={value}
              style={{
                border: "none",
              }}
              readOnly={!readOnly}
              onChange={(value) => {
                if (!item.dataIndex) return;
                const cur = current || deepCopyObject(record);
                if (typeof item.dataIndex === "string") {
                  edit[item.dataIndex] = value;
                  cur[item.dataIndex] = value;
                } else {
                  item.dataIndex.reduce((pre, cur, index) => {
                    if (!item.dataIndex) return;
                    if (index === item.dataIndex.length - 1) {
                      pre[cur] = value;
                    }
                    return pre[cur]
                  }, edit)
                  item.dataIndex.reduce((pre, cur, index) => {
                    if (!item.dataIndex) return;
                    if (index === item.dataIndex.length - 1) {
                      pre[cur] = value;
                    }
                    return pre[cur]
                  }, cur)
                }
                setEdit({ ...edit });
                setCurrent(cur)
              }}
            />
          }
          return text;
        }
      })
    })
  }, [columns, current, edit])
  useEffect(() => {
    setCurrent(null)
    setEdit({})
  }, [dataSource])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onChange = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys)
  }, [])
  return (
    <div
      className="flex flex-col gap-2"
    >
      <div className="flex justify-end gap-2">
        {!!onCreate && hasRole([CREATE_POWER]) && <Button
          onClick={onCreate}
          type="link"
          shape="circle"
          icon={<PlusOutlined />}
        />}
        {!!onChangeItem && hasRole([UPDATE_POWER]) && <Button
          onClick={() => {
            if (!onChangeItem) return;
            if (!current) return
            onChangeItem(current, edit)
          }}
          disabled={Object.keys(edit).length === 0 && !current}
          type="link"
          shape="circle"
          icon={<CheckOutlined />}
        />}
        {!!onChangeItem && hasRole([UPDATE_POWER]) && <Button
          onClick={() => {
            setCurrent(null);
            setEdit({});
          }}
          type="link"
          disabled={Object.keys(edit).length === 0}
          danger
          shape="circle"
          icon={<CloseOutlined />}
        />}
        {!!onDelete && hasRole([DELETE_POWER]) && <DelPopover
          onDelete={() => {
            if (!onDelete) return;
            onDelete(selectedRowKeys.map((item) => Number(item)))
          }}
        >
          <Button
            type="link"
            disabled={selectedRowKeys.length === 0}

            danger
            shape="circle"
            icon={<DeleteOutlined />}
          />
        </DelPopover>}
      </div>
      <Table
        {...rest}
        rowClassName={(record) => {
          if (current?.id === record.id) return "bg-blue-200 hover:bg-blue-300"
          return ""
        }}
        rowSelection={!!onChangeItem ? {
          onChange,
          selectedRowKeys
        } : undefined}
        dataSource={dataSource}
        columns={tableColumns}
      />
    </div>)
}
export default EditTable