import type {ScheduleConfigRequestWithScheduleType} from "@/types/schedule.ts";
import {Controller, type ErrorOption, useForm} from "react-hook-form";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info} from "lucide-react";
import {useJobGroups} from "@/hooks/queries/useJobGroups.ts";
import {useJobNames} from "@/hooks/queries/useJobNames.ts";
import {useJobParams} from "@/hooks/queries/useJobParams.ts";
import {useCreateSchedule} from "@/hooks/queries/useScheduleMutations.ts";
import {toast} from "sonner";
import type {AxiosError} from "axios";

const baseSchema = z.object({
    scheduleType: z.enum(["Simple", "Cron"]),

    jobGroup: z.string().min(1, "Job group is required"),
    jobName: z.string().min(1, "Job name is required"),
    triggerName: z.string().min(1, "Schedule name is required"),

    // common optional fields
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    repeatCount: z.coerce.number().int().min(0).optional(),
    repeatIntervalInSeconds: z.coerce.number().int().optional(),
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

        if (data.repeatIntervalInSeconds && data.repeatIntervalInSeconds < 60) {
            ctx.addIssue({
                code: "custom",
                path: ["repeatIntervalInSeconds"],
                message: "Repeat interval must be over 60 seconds",
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
    values: ScheduleConfigRequestWithScheduleType,
    jobParams: { name: string; required?: boolean }[]
) {
    const errors: Record<string, ErrorOption> = {};

    jobParams.forEach((param) => {
        const value = values?.triggerDataMap?.[param.name];

        if (param.required && (!value || value.trim() === "")) {
            errors[`triggerDataMap.${param.name}`] = {
                type: "manual",
                message: `${camelToTitle(param.name)} is required`,
            };
        }
    });

    return errors;
}

const ScheduleConfigForm = () => {

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

    const {data: jobGroups} = useJobGroups();
    const {data: jobNames} = useJobNames(selectedJobGroup);
    const {data: jobParams = [], isFetching: isFetchingJobParams} = useJobParams(selectedJobGroup, selectedJobName);

    const {mutate: createSchedule} = useCreateSchedule();

    const onsubmit = (data: ScheduleConfigRequestWithScheduleType) => {
        const paramErrors = validateJobParams(data, jobParams);

        if (Object.keys(paramErrors).length > 0) {
            Object.entries(paramErrors).forEach(([path, err]) => {
                setError(path as Parameters<typeof setError>[0], err);
            });
            return;
        }

        createSchedule(data, {
            onSuccess: () => {
                toast.success("Schedule has been created successfully.", {
                    position: "bottom-right",
                })
                reset()
            },
            onError: (err: AxiosError<string>) => {
                const errorMessage = JSON.stringify(err.response?.data)
                console.log(errorMessage)
                toast.error(errorMessage, {
                    position: "bottom-right",
                })
            }
        })
    };

    useEffect(() => {
        reset((prev) => ({
            ...prev,
            triggerDataMap: {},
        }));
    }, [reset]);


    return (
        <section className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Schedule Configuration</h1>
                <p className="text-sm text-muted-foreground">
                    Configure you schedule with simple or cron-based timing
                </p>
            </div>
            <form onSubmit={handleSubmit(onsubmit)} id="form-rhf-input">
                <FieldGroup className="mb-8">
                    <Controller name="scheduleType" control={control} render={({field, fieldState}) => (
                        <Field className="md:w-1/2"
                               data-invalid={fieldState.invalid}>
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
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    <SelectItem value="Simple">Simple</SelectItem>
                                    <SelectItem value="Cron">Cron</SelectItem>
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}/>
                </FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Controller name="jobGroup" control={control} render={({field, fieldState}) => (
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
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent position="item-aligned" onCloseAutoFocus={e => e.preventDefault()}>
                                    {
                                        jobGroups?.map((gp: string, idx: number) => (
                                            <SelectItem key={idx} value={gp}>{gp}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}/>
                    <Controller name="jobName" control={control} render={({field, fieldState}) => (
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
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent position="item-aligned" onCloseAutoFocus={e => e.preventDefault()}>
                                    {
                                        jobNames?.map((name: string, idx: number) => (
                                            <SelectItem key={idx} value={name}>{name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}/>
                    <Controller name="triggerName" control={control} render={({field, fieldState}) => (
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
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}/>
                </div>
                <FieldGroup>
                    {selectedScheduleType === "Simple" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Controller name="startAt" control={control} render={({field, fieldState}) => (
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
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}/>
                            <Controller name="endAt" control={control} render={({field, fieldState}) => (
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
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}/>
                            <Controller name="repeatCount" control={control} render={({field, fieldState}) => (
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
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}/>
                            <Controller name="repeatIntervalInSeconds" control={control}
                                        render={({field, fieldState}) => (
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
                                                    <FieldError errors={[fieldState.error]}/>
                                                )}
                                            </Field>
                                        )}/>
                        </div>
                    )}
                    {
                        selectedScheduleType === "Cron" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Controller name="cronExpression" control={control} render={({field, fieldState}) => (
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
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}/>
                                <Controller name="endAt" control={control} render={({field, fieldState}) => (
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
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}/>
                            </div>
                        )
                    }
                </FieldGroup>
                <FieldGroup>
                    {jobParams.length > 0 && (
                        <h3 className="text-lg font-medium border-b pb-2">Job Parameters</h3>
                    )}
                    {jobParams.length === 0 && !isFetchingJobParams && (
                        <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">No parameters required
                            for this job.</p>
                    )}
                    {isFetchingJobParams && (
                        <div className="flex items-center space-x-2 p-4 text-sm text-muted-foreground">
                                    <span className="relative flex h-3 w-3">
                                        <span
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                            <span>Loading parameters...</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {
                            jobParams.map((param, index) => (
                                <Controller key={index} name={`triggerDataMap.${param.name}`} control={control}
                                            defaultValue="" render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex gap-2">
                                            <FieldLabel htmlFor={`${param.name}-${index}`}>
                                                {camelToTitle(param.name)}
                                            </FieldLabel>

                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info size="15"/>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{param.description}</p>
                                                </TooltipContent>
                                            </Tooltip>

                                        </div>
                                        <Input
                                            {...field}
                                            id={`${param.name}-${index}`}
                                            aria-invalid={fieldState.invalid}
                                            placeholder=""
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}/>
                            ))
                        }
                    </div>
                </FieldGroup>
                <div className="flex justify-end space-x-4 border-t bg-muted/20 px-6 py-4">
                    <Button type="button" variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-rhf-input">
                        Save Configuration
                    </Button>
                </div>
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