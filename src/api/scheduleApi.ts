import {scheduleClient} from "@/api/scheduleClient.ts";
import type {
    JobParam,
    ScheduleConfigRequestWithScheduleType,
    ScheduleItem,
    TriggerActionsProps
} from "@/types/schedule.ts";

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

export const createSchedule = async (object: ScheduleConfigRequestWithScheduleType): Promise<string> => {
    const {scheduleType, ...request} = object;
    const path: string = scheduleType === "Simple" ? import.meta.env.VITE_SCHEDULE_SIMPLE_CREATE_PATH : import.meta.env.VITE_SCHEDULE_CRON_CREATE_PATH
    console.log(path)
    const {data} = await scheduleClient.post<string>(path, JSON.stringify(request));
    return data;
}

export const pauseSchedule = async (object: TriggerActionsProps): Promise<string> => {
    const request = {
        name: object.triggerName,
        group: object.triggerGroup,
    }
    const path: string = import.meta.env.VITE_PAUSE_SCHEDULE_PATH;
    console.log(path)
    const {data} = await scheduleClient.post<string>(path, JSON.stringify(request));
    return data;
}

export const resumeSchedule = async (object: TriggerActionsProps): Promise<string> => {
    const request = {
        name: object.triggerName,
        group: object.triggerGroup,
    }
    const path: string = import.meta.env.VITE_RESUME_SCHEDULE_PATH;
    console.log(path)
    const {data} = await scheduleClient.post<string>(path, JSON.stringify(request));
    return data;
}

export const deleteSchedule = async (object: TriggerActionsProps): Promise<string> => {
    const path: string = `${import.meta.env.VITE_DELETE_SCHEDULE_PATH}/${object.triggerGroup}`;
    console.log(path)
    const {data} = await scheduleClient.delete<string>(path, {
        params: {
            name: object.triggerName
        }
    });
    return data;
}

export const getAllActiveJobs = async (): Promise<ScheduleItem[]> => {
    const path: string = import.meta.env.VITE_ACTIVE_SCHEDULE_PATH;
    const {data} = await scheduleClient.get(path);
    return data;
}