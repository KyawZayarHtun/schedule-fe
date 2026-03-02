import {createColumnHelper} from "@tanstack/react-table";
import type {JobDef} from "@/types/schedule.ts";
import {Badge} from "@/components/ui/badge.tsx";
import ScheduleJobActions from "@/components/table/scheduler/job/ScheduleJobActions.tsx";

const columnHelper  = createColumnHelper<JobDef>();

export const scheduleJobColumns = [
    columnHelper.accessor('name', {
        header: "Job Name",
        cell: props => <span className="font-medium">{props.getValue()}</span>,
        filterFn: "includesString"
    }),
    columnHelper.accessor('group', {
        header: "Job Group",
        cell: props => <Badge variant="outline">{props.getValue()}</Badge>,
    }),
    columnHelper.accessor('description', {
        header: "Job Description",
        cell: props => <span className="font-medium">{props.getValue()}</span>,
    }),
    columnHelper.display({
        header: "Actions",
        cell: props => <ScheduleJobActions job={props.row.original}/>,
    })

]