import { Image } from "antd"
import useFile from "../hooks/useFile"
import { file2base64 } from "../libs/utils"


export type CoverInputProps = {
  onChange?: (base64: string) => void,
  value?: string
}
const CoverInput = ({
  value,
  onChange
}: CoverInputProps) => {
  const onClick = useFile({
    async onComplete([file]) {
      if (!!onChange) onChange(await file2base64(file))
    },
    multiple: false,
    accept: "image/*"
  })
  if (!value) {
    return (
      <div onClick={() => onClick()} className="w-32 h-32 border border-dashed cursor-pointer flex justify-center items-center">
        选择图片
      </div>
    )
  }
  return (
    <Image
      src={value}
    />
  )
}
export default CoverInput