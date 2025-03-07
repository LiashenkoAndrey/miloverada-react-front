import {POST_METHOD} from "../../../Constants";
import {callAndGetResult} from "../shared/ExternalApiService";
import {CREATE_APPLICATION} from "../../Constants";


export async function createApplication(formData : FormData) {
  const config = {
    url: CREATE_APPLICATION,
    method: POST_METHOD,
    data: formData,
  }
  return await callAndGetResult(config)
}