import { AxiosResponse } from "axios"
import { API } from "../utils/Api"

interface IPages {
  id: number
  created_at: Date
  url: string
  page_features: any
}

export const fetchEmails = async (): Promise<AxiosResponse<any>> => {
  return await API.get(`/admin/emails`)
}