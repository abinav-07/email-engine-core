import { AxiosResponse } from "axios"
import { API } from "../utils/Api"

export const fetchEmails = async (): Promise<AxiosResponse<any>> => {
  return await API.get(`/admin/emails`)
}
