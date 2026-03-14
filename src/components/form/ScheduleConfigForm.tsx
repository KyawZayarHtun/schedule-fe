import type { ScheduleConfigRequestWithScheduleType } from "@/types/schedule.ts";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/api/scheduleApi.ts";
import {Controller, type ErrorOption, useForm} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const baseSchema = z.object({
    scheduleType: z.enum(["Simple", "Cron"]),

    jobGroup: z.string().min(1, "Job group is required"),
    jobName: z.string().min(1, "Job name is required"),
    triggerName: z.string().min(1, "Schedule name is required"),

    // common optional fields
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    repeatCount: z.coerce.number().int().min(0).optional(),
    repeatIntervalInSeconds: z.coerce.number().int().min(60).optional(),
    cronExpression: z.string().optional(),

    triggerDataMap: z.record(z.string(), z.string()).default({}),
});
const scheduleSchema = baseSchema.superRefine((data, ctx) => {
    if (data.scheduleType === "Simple") {
        if (!data.startAt) {
            ctx.addIssue({
                code: "custom",
                path: ["startAt"],
                message: "Start date is required",
            });
        }

        if (!data.repeatIntervalInSeconds) {
            ctx.addIssue({
                code: "custom",
                path: ["repeatIntervalInSeconds"],
                message: "Repeat interval is required",
            });
        }
    }

    if (data.scheduleType === "Cron") {
        if (!data.cronExpression || data.cronExpression.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                path: ["cronExpression"],
                message: "Cron expression is required",
            });
        }
    }
});

function validateJobParams(
    values: ScheduleConfigRequestWithScheduleType ,
    jobParams: { name: string; required?: boolean }[]
) {
    const errors: Record<string, ErrorOption> = {};

    jobParams.forEach((param) => {
        const value = values?.triggerDataMap?.[param.name];

        if (param.required && (!value || value.trim() === "")) {
            errors[`triggerDataMap.${param.name}`] = {
                type: "manual",
                message: `${param.name} is required`,
            };
        }
    });

    return errors;
}


type ScheduleConfigFormProps = {
    onSubmit: (data: ScheduleConfigRequestWithScheduleType) => void;
}

const ScheduleConfigForm = ({ onSubmit: externalSubmit }: ScheduleConfigFormProps) => {

    const {
        handleSubmit,
        watch,
        control,
        reset,
        setError,
    } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            scheduleType: "Simple",
            jobGroup: "",
            jobName: "",
            triggerName: "",
            startAt: "",
            endAt: "",
            repeatCount: 0,
            repeatIntervalInSeconds: 0,
            cronExpression: "",
            triggerDataMap: {},
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedScheduleType = watch("scheduleType");
    const selectedJobGroup = watch("jobGroup");
    const selectedJobName = watch("jobName");

    const { data: jobGroups } = useQuery({
        queryKey: ['jobGroups'],
        queryFn: () => api.getAllJobGroups(),
        staleTime: 30 * 1000,
    })

    const { data: jobNames } = useQuery({
        queryKey: ['jobNames', selectedJobGroup],
        queryFn: () => api.getJobNamesByGroup(selectedJobGroup),
        enabled: !!selectedJobGroup,
        staleTime: 30 * 1000,
    })

    const { data: jobParams = [], isFetching: isFetchingJobParams } = useQuery({
        queryKey: ['jobParams', selectedJobGroup, selectedJobName],
        queryFn: () => api.getExpectedJobParams(selectedJobGroup, selectedJobName),
        enabled: !!selectedJobGroup && !!selectedJobName,
        staleTime: 30 * 1000,
    })



    const onsubmit = (data: ScheduleConfigRequestWithScheduleType) => {
        const paramErrors = validateJobParams(data, jobParams);

        if (Object.keys(paramErrors).length > 0) {
            Object.entries(paramErrors).forEach(([path, err]) => {
                setError(path as Parameters<typeof setError>[0], err);
            });
            return;
        }

        externalSubmit(data as ScheduleConfigRequestWithScheduleType);
    };

    useEffect(() => {
        reset((prev) => ({
            ...prev,
            triggerDataMap: {},
        }));
    }, [reset]);


    return (
        <section className="w-full max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold mb-3">Schedule Configuration</h1>
                <p className="text-sm text-muted-foreground">
                    Configure you schedule with simple or cron-based timing
                </p>
            </div>
            <form onSubmit={handleSubmit(onsubmit)} id="form-rhf-input">
                <FieldGroup>
                    <Controller name="scheduleType" control={control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="sheduleType">
                                Schedule Type
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="scheduleType"
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    <SelectItem value="Simple">Simple</SelectItem>
                                    <SelectItem value="Cron">Cron</SelectItem>
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                </FieldGroup>
                <FieldGroup>
                    <Controller name="jobGroup" control={control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="jobGroup">
                                Job Group
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="jobGroup"
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {
                                        jobGroups?.map((gp: string, idx: number) => (
                                            <SelectItem key={idx} value={gp}>{gp}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                    <Controller name="jobName" control={control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="jobName">
                                Job Name
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="jobName"
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {
                                        jobNames?.map((name: string, idx: number) => (
                                            <SelectItem key={idx} value={name}>{name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                    <Controller name="triggerName" control={control} render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="triggerName">
                                Schedule Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="triggerName"
                                aria-invalid={fieldState.invalid}
                                placeholder=""
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                </FieldGroup>
                <FieldGroup>
                    {selectedScheduleType === "Simple" && (
                        <>
                            <Controller name="startAt" control={control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="startAt">
                                        Start At
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="startAt"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=""
                                        autoComplete="off"
                                        type="datetime-local"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="endAt" control={control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="endAt">
                                        End At
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="endAt"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=""
                                        autoComplete="off"
                                        type="datetime-local"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="repeatCount" control={control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="repeatCount">
                                        Repeat Count <i>If empty, it will be infinite!</i>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="repeatCount"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=""
                                        autoComplete="off"
                                        type="number"
                                        value={field.value as number} 
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="repeatIntervalInSeconds" control={control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="repeatIntervalInSeconds">
                                        Repeat Interval <strong>In Second!</strong>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="repeatIntervalInSeconds"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=""
                                        autoComplete="off"
                                        type="number"
                                        value={field.value as number}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                        </>
                    )}
                    {
                        selectedScheduleType === "Cron" && (
                            <>
                                <Controller name="cronExpression" control={control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="cronExpression">
                                            Cron Expression
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="cronExpression"
                                            aria-invalid={fieldState.invalid}
                                            placeholder=""
                                            autoComplete="off"
                                            type="text"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                                <Controller name="endAt" control={control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="endAt">
                                            End At
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="endAt"
                                            aria-invalid={fieldState.invalid}
                                            placeholder=""
                                            autoComplete="off"
                                            type="datetime-local"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                            </>
                        )
                    }
                </FieldGroup>
                <FieldGroup>
                    {jobParams.length === 0 && !isFetchingJobParams && (
                        <p className="text-sm text-muted-foreground">No parameters required for this job.</p>
                    )}
                    {isFetchingJobParams && (
                        <p className="text-sm text-muted-foreground">Loading..............</p>
                    )}
                    {
                        jobParams.map((param, index) => (
                            <Controller key={index} name={`triggerDataMap.${param.name}`} control={control} defaultValue="" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`${param.name}-${index}`}>
                                        {camelToTitle(param.name)}
                                    </FieldLabel>
                                    <FieldDescription>
                                        {param.description}
                                    </FieldDescription>
                                    <Input
                                        {...field}
                                        id={`${param.name}-${index}`}
                                        aria-invalid={fieldState.invalid}
                                        placeholder=""
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                        ))
                    }
                </FieldGroup>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-rhf-input">
                        Save
                    </Button>
                </Field>
            </form>
        </section>
    );
};

function camelToTitle(str: string) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim();
}

export default ScheduleConfigForm;