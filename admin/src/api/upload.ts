import request from ".";


// 上传大纲文件
export const outlineUploadFile = (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file)
  return request.post(`/outline/${id}/upload`, formData)
}