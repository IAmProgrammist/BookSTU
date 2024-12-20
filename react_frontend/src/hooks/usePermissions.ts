import { useGetUserMeQuery } from "../redux/api/baseApi";

export function usePermissions() {
    const { data: meData, isSuccess } = useGetUserMeQuery({});

    return {
        data: isSuccess && meData?.permissions ? meData.permissions : [],
        isSuccess
    }
}