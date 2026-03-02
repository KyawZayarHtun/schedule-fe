import {scheduleClient} from "@/api/scheduleClient.ts";
import type {JobParam} from "@/types/schedule.ts";

export const getAllJobGroups = async (): Promise<string[]> => {
    const path: string = import.meta.env.VITE_SCHEDULE_JOB_GROUP_PATH;
    const {data} = await scheduleClient.get(path);
    return data;
}

export const getJobNamesByGroup = async (jobGroup: string): Promise<string[]> => {
    const path: string = import.meta.env.VITE_SCHEDULE_NAMES_BY_GROUP_PATH;
    const {data} = await scheduleClient.get(`${path}/${jobGroup}`);
    return data;
}

export const getExpectedJobParams = async (jobGroup: string, jobName: string): Promise<JobParam[]> => {
    const path: string = import.meta.env.VITE_SCHEDULE_JOB_PARAM_PATH;
    const {data} = await scheduleClient.get(`${path}/${jobGroup}/${jobName}`);
    return data;
}