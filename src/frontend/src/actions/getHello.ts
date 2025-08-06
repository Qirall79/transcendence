import { Fetcher } from "@/utils/Fetcher";

const api_url = import.meta.env.VITE_API_URL;

export const getHello = async (resetUser?: any) => {
    try {
        const response = await Fetcher.get("/dummy/", resetUser);
        const data = await response.json()
        return data
    } catch (error) {
        return null;
    }
}