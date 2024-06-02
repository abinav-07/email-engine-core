import { AxiosResponse } from "axios"
import { API } from "../utils/Api"

export const createUser = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.post(`/auth/register`, values)
}

export const loginUser = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.post(`/auth/login`, values)
}



export const updateUser = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.patch(`/auth/callback`, values)
}

// ADMIN SERIVCES
export const updateUserAdmin = async (values: any): Promise<AxiosResponse<any[]>> => {
  return await API.patch(`/admin/members/update`, values)
}


export const fetchUsers = async (): Promise<AxiosResponse<any[]>> => {
  return await API.get(`/admin/members`)
}

