import axios, {AxiosRequestConfig} from "axios";


export const callExternalApi = async (options: AxiosRequestConfig) => {
    try {
        const response = await axios(options);

        const {data} = response;

        return {
            code: response.status,
            data,
            error: null,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;

            const { response } = axiosError;

            console.debug(error.name, error.message, error.request.responseURL)
            return {
                data: null,
                // @ts-ignore
                code: response.status,
                error: {
                    axiosError,
                },
            };
        }
        console.debug("External Api Error: ", error)

        return {
            data: null,
            code : null,
            error: {
                message: error,
            },
        };
    }
}

export const callAndGetResult = async (config: AxiosRequestConfig) => {
    const { data, error, code } = await callExternalApi(config);
    return {
        data: data || null,
        error,
        code: code ?? undefined
    };
}