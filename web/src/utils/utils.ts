import { Buffer } from "buffer"

export const parseJwt = () => {
  const token = localStorage.getItem("role-token")
  if (!token) {
    return null
  }
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace("-", "+").replace("_", "/")

  return JSON.parse(Buffer.from(base64, "base64").toString())
}

export const removeToken = (itemName: string) => {
  localStorage.removeItem(itemName)
  sessionStorage.removeItem(itemName)
}
