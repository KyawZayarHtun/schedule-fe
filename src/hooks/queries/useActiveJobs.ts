import {useQuery} from "@tanstack/react-query";
import * as api from "@/api/scheduleApi.ts";

export const ACTIVE_JOBS = ["activeJobs"] as const;

export const useActiveJobs = () => {
    return useQuery({
        queryKey: [ACTIVE_JOBS],
        queryFn: () => api.getAllActiveJobs(),
        staleTime: 30 * 1000,
    })
}