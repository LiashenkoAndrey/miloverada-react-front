import axios, {AxiosRequestConfig} from "axios";


export const callExternalApi = async (options: AxiosRequestConfig) => {
    try {
        const response = await axios(options);

        const {data} = response;

        return {
            data,
            error: null,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;

            const { response } = axiosError;

            let message = "http request failed";

            if (response && response.statusText) {
                message = response.statusText;
            }

            if (axiosError.message) {
                message = axiosError.message;
            }

            if (response && response.data && response.data.message) {
                message = response.data.message;
            }
            // @ts-ignore
            console.log(error.name, error.message, error.request.responseURL)
            return {
                data: null,
                error: {
                    message,
                },
            };
        }
        console.log("External Api Error: ", error)

        return {
            data: null,
            error: {
                message: error,
            },
        };
    }
}

export const callAndGetResult = async (config: AxiosRequestConfig) => {
    const { data, error } = await callExternalApi(config);
    return {
        data: data || null,
        error,
    };
}