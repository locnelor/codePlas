

export type UseFileOptions = {
  onComplete?: (files: File[]) => any,
  accept?: string
  multiple?: boolean
}
const useFile = (options: UseFileOptions = {}) => {
  const open = ({
    onComplete,
    accept = "",
    multiple = false
  } = options) => {
    return new Promise<File[]>((resolve) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = accept
      input.multiple = multiple
      input.onchange = () => {
        const files = Array.from(input.files || [])
        resolve(files)
        if (!!onComplete) onComplete(files)
      }
      input.click()
    })
  }
  return open
}
export default useFile