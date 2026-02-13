export type JobParam = {
  name: string;
  description: string;
  required: boolean;
  array: boolean;
}

export type JobDef = {
  name: string;
  group: string;
  description: string;
  expectedJobDataParameters: JobParam[];
}

export interface TriggerDataMap {
  [key: string]: string | undefined;
}

export interface ScheduleItem {
  jobGroup: string;
  jobName: string;
  jobDescription: string;
  triggerGroup: string;
  triggerName: string;
  triggerState: "NORMAL" | "PAUSED" | "ERROR" | "BLOCKED"; // Added likely states
  triggerType: "Cron" | "Simple";
  nextFireTime: string | null;
  previousFireTime: string | null;
  startTime: string;
  endTime: string | null;
  triggerDataMap: TriggerDataMap;
  simpleTriggerRepeatCount: number | null;
  simpleTriggerRepeatInterval: number | null;
  cronExpression: string | null;
}

export interface ScheduleItemWithAction extends ScheduleItem {
  actions: string
}