import {useQuery} from "@tanstack/react-query";
import * as api from "@/api/scheduleApi.ts";

export const JOB_PARAMS_KEY = (jobGroup: string, jobName: string) => ["jobParams", jobGroup, jobName] as const;

export const useJobParams = (jobGroup: string, jobName: string) => {
    return useQuery({
        queryKey: JOB_PARAMS_KEY(jobGroup, jobName),
        queryFn: () => api.getExpectedJobParams(jobGroup, jobName),
        enabled: !!jobGroup && !!jobName,
        staleTime: 30 * 1000,
    })
}