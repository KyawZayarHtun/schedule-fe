import {useQuery} from "@tanstack/react-query";
import * as api from "@/api/scheduleApi.ts";

export const JOB_NAMES_KEY = (jobGroup: string) => ["jobNames", jobGroup] as const;

export const useJobNames = (jobGroup: string) => {
    return useQuery({
        queryKey: JOB_NAMES_KEY(jobGroup),
        queryFn: () => api.getJobNamesByGroup(jobGroup),
        enabled: !!jobGroup,
        staleTime: 30 * 1000,
    })
}