import {useQuery} from "@tanstack/react-query";
import * as api from "@/api/scheduleApi.ts";

export const JOB_GROUPS_KEY = ["jobGroups"] as const;

export const useJobGroups = () => {
    return useQuery({
        queryKey: [JOB_GROUPS_KEY],
        queryFn: () => api.getAllJobGroups(),
        staleTime: 30 * 1000,
    })
}