import { PropsWithChildren, useEffect } from "react"
import FormFactory, { FormFactoryProps } from "./FormFactory"


type SearchFormProps = {
  name?: string
} & FormFactoryProps
const SearchForm = ({
  options,
  formProps,
  name,
  children
}: PropsWithChildren<SearchFormProps>) => {
  useEffect(() => {
    const setFormValue = () => {
      if (!name) return;
      const history = window.localStorage.getItem(`search_history_${name}`)
      if (!history) return;
      if (!formProps?.form) return;
      try {
        const historyData = JSON.parse(history)
        formProps.form.setFieldsValue(historyData)
      } catch (e) {
        console.error(`search form ${name} history parse error`)
      }
    }
    if (!formProps?.form) return;
    setFormValue()
    formProps.form.submit()
  }, [])
  return (
    <FormFactory
      options={options}
      formProps={{
        ...formProps,
        onFinish: (data) => {
          if (!formProps?.onFinish) return;
          formProps.onFinish(data)
          if (!name) return;
          window.localStorage.setItem(`search_history_${name}`, JSON.stringify(data))
        }
      }}
    >
      {children}
    </FormFactory>
  )
}
export default SearchForm