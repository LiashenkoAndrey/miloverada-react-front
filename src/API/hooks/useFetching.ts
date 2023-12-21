import {useState} from "react";


export const useFetching = (callback: () => Promise<void>) : [Function, boolean, (Error | null)] => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetching = async () => {
        try {
            setIsLoading(true)
            await callback;
        } catch (e) {
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }
    return [fetching, isLoading, error]
}
