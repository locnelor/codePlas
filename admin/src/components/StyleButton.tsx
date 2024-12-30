import { Button, ConfigProvider } from "antd"
import { ButtonProps } from "antd/lib"
import { PropsWithChildren } from "react"


type StyleButtonProps = {
  buttonProps?: ButtonProps
  theme?: any
}
const StyleButton = ({
  buttonProps,
  theme,
  children
}: PropsWithChildren<StyleButtonProps>) => {

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: theme
        }
      }}
    >
      <Button
        {...buttonProps}
      >
        {children}
      </Button>
    </ConfigProvider>
  )
}
export default StyleButton