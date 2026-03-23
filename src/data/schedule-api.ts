import { z } from "zod";
import type {ScheduleConfigRequest} from "@/types/schedule.ts";

// --- Types based on your JSON ---
export type FieldDefinition = {
  name: string;
  description: string;
  required: boolean;
  array: boolean;
};

// --- Mock Data ---
export const MOCK_GROUPS = ["Notification", "Reporting", "Maintenance"];
export const MOCK_JOBS: Record<string, string[]> = {
  Notification: ["EmailJob", "SmsJob"],
  Reporting: ["DailySummary", "MonthlyAudit"],
  Maintenance: ["CleanupLogs", "BackupDb"],
};

export const MOCK_DEFINITIONS: Record<string, FieldDefinition[]> = {
  "Notification-EmailJob": [
    { name: "subject", description: "Subject line", required: true, array: false },
    { name: "body", description: "Main content", required: true, array: false },
    { name: "toRecipients", description: "Emails (comma separated)", required: true, array: true },
    { name: "ccRecipients", description: "CC Emails", required: false, array: true },
  ],
  "Notification-SmsJob": [
    { name: "phoneNo", description: "Target Phone Number", required: true, array: false },
  ],
};

// --- Mock API Calls ---
export const fetchJobGroups = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_GROUPS;
};

export const fetchJobNames = async (group: string) => {
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_JOBS[group] || [];
};

export const fetchTriggerDefinitions = async (group: string, job: string) => {
  await new Promise((r) => setTimeout(r, 600)); // slightly slower to show loading state
  const key = `${group}-${job}`;
  return MOCK_DEFINITIONS[key] || [];
};

export const createSchedule = async (data: ScheduleConfigRequest) => {
  await new Promise((r) => setTimeout(r, 1000));
  console.log("Submitting Payload:", JSON.stringify(data, null, 2));
  return { success: true };
};