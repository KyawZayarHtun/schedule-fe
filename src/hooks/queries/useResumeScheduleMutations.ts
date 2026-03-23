import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TriggerActionsProps} from "@/types/schedule.ts";
import * as api from "@/api/scheduleApi.ts";
import type {AxiosError} from "axios";
import {ACTIVE_JOBS} from "@/hooks/queries/useActiveJobs.ts";


// export const SCHEDULE_KEYS = {
//     create: ["pause-schedule"] as const
// };

export const useResumeSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TriggerActionsProps) => {
            return api.resumeSchedule(data)
        },
        onSuccess: (data: string) => {
            console.log(data)
            return queryClient.invalidateQueries({ queryKey: [ACTIVE_JOBS] });
        },
        onError: (error: AxiosError<string>) => {
            const errorMessage = error.response?.data
                || error.message
                || "An unexpected error occurred";
            console.error("Failed to resume schedule:", errorMessage);
            return errorMessage
        }
    })
};
