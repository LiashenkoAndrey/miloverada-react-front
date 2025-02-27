import {API_SERVER_URL, DELETE_METHOD, POST_METHOD, PROTECTED_API} from "../../../Constants";
import {callAndGetResult} from "../shared/ExternalApiService";
import {message} from "antd";
import axios from "axios";

export interface LinkBanner {
  id: number
  imageUrl : string
  url: string
  text: string
  createdOn: string[]
  addedBy : AppUser
}

interface AppUser {
  id : string,
  firstName : string,
  lastName : string,
  email : string
}

export interface TextBanner {
  id: number
  description: string
  mainText: string
  createdOn: string[]
}

export function getAllLinkBanners() {
  const config = {
    url: `${API_SERVER_URL}/api/link-banners?sort=createdOn,desc`,
    method: "GET"
  }
  return callAndGetResult(config)
}

export type CreateLinkBannerRequest = {
  url: string;
  text: string;
  image?: string
};

export async function createLinkBanner(createLinkBanner: FormData, jwt: string) {
  return await axios.post(`${PROTECTED_API}/link-banners`, createLinkBanner, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'multipart/form-data',
    }
  })
}

export async function deleteLinkBanner(id: number, jwt: string) {
  return await deleteRequest(`${PROTECTED_API}/link-banners/${id}`, jwt)
}

export async function post(url: string, payload: any, jwt: string) {
    const config = {
        url: url,
        method: POST_METHOD,
        data: payload,
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
  const {data, error, code} =  await callAndGetResult(config)
  if (error) {
    console.log("Помилка: ", code)
    message.error("Помилка: " + code, 1)
    return undefined;
  }
  return {
    data: data
  }
}

export async function deleteRequest(url: string, jwt: string) {
    const config = {
        url: url,
        method: DELETE_METHOD,
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
  const {error, code} =  await callAndGetResult(config)
  if (error) {
    console.log("Помилка: ", code)
    message.error("Помилка: " + code, 1)
    return undefined;
  }
  return {
    code: code
  }
}
