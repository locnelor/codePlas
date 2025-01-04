import { gql, useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { Button, Card, message } from "antd"
import { Editor } from 'primereact/editor';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import HeadBack from "../../../components/HeadBack";
import { BaseFields } from "../../../queries/base";
import { NoticeFields } from "../../../queries/notices";
import { UserFields } from "../../../queries/user";
import gqlError from "../../../libs/gql-error";



export const GetNoticeByIdQuery = gql`
  query GetNoticeById(
    $id: Int!
  ){
    getNoticeById(
      id: $id
    ){
      ${BaseFields}
      ${NoticeFields}
      creator{
        ${UserFields}
        ${BaseFields}
      }
    }
  }
`
export const UpdateNoticeContextMutation = gql`
  mutation UpdateNoticeContext(
    $id: Int!,
    $context: String!
  ){
    updateNoticeContext(
      id: $id,
      context: $context
    )
  }
`
const NoticeAction = () => {
  const [context, setContext] = useState("")
  const location = useLocation();
  const nav = useNavigate();
  const client = useApolloClient();
  const [update, { loading }] = useMutation(UpdateNoticeContextMutation, {
    onCompleted: () => {
      message.success("保存成功")
      nav("/notices")
      client.refetchQueries({
        include: ["GetNotices"]
      })
    },
    onError: (err) => {
      gqlError(err)
    }
  })
  const queryParams = new URLSearchParams(location.search);
  const id = parseInt(queryParams.get("id") || "0")
  const [getData, { data }] = useLazyQuery(GetNoticeByIdQuery, {
    onCompleted({ getNoticeById }) {
      setContext(getNoticeById.context)
    },
    fetchPolicy: "network-only"
  })
  useEffect(() => {
    if (!!id) {
      getData({
        variables: {
          id
        }
      })
    }
  }, [id])
  const onSave = useCallback(() => {
    update({
      variables: {
        id,
        context
      }
    })
  }, [id, context])
  const entity = useMemo(() => {
    return data?.getNoticeById
  }, [data])
  return (
    <Card>
      <HeadBack
        href="/notices"
      >
        <Button loading={loading} type="primary" onClick={onSave}>保存</Button>
      </HeadBack>
      <div className="text-2xl font-bold">
        {entity?.title}
      </div>
      <Editor
        value={context}
        onTextChange={(e) => setContext(e.htmlValue as string)}
        style={{ minHeight: "500px" }}
      />
    </Card>
  )
}
export default NoticeAction