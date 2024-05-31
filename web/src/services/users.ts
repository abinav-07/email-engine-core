import { AxiosResponse } from "axios"
import { API } from "../utils/Api"

export const createUser = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.post(`/auth/register`, values)
}

export const loginUser = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.post(`/auth/login`, values)
}

export const getUserFeatures = async (): Promise<AxiosResponse<any[]>> => {
  return await API.get(`/features`)
}

export const fetchUsers = async (): Promise<AxiosResponse<any[]>> => {
  return await API.get(`/admin/members`)
}

export const updateUser = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.patch(`/admin/member/update`, values)
}
