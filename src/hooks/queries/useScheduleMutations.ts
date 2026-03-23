import {useMutation} from "@tanstack/react-query";
import type {ScheduleConfigRequestWithScheduleType} from "@/types/schedule.ts";
import * as api from "@/api/scheduleApi.ts";
import type {AxiosError} from "axios";


// export const SCHEDULE_KEYS = {
//     create: ["create-schedule"] as const
// };

export const useCreateSchedule = () => {

    return useMutation({
        mutationFn: (data: ScheduleConfigRequestWithScheduleType) => {
            return api.createSchedule(data)
        },
        onSuccess: (data: string) => {

            console.log(data)
        },
        onError: (error: AxiosError<string>) => {
            const errorMessage = error.response?.data
                || error.message
                || "An unexpected error occurred";
            console.error("Failed to create schedule:", errorMessage);
        }
    })
};
