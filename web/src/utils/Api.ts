import axios from "axios"
import { API_URL } from "../config"

const API = axios.create({
  baseURL: `${API_URL}/v1`,
  responseType: "json",
})

API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("role-token")

    if (token) {
      config.headers["Authorization"] = "Bearer " + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export { API }
