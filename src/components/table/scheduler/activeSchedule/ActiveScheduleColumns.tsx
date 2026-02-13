import {createColumnHelper} from "@tanstack/react-table";
import type {ScheduleItem} from "@/types/schedule.ts";
import {Badge} from "@/components/ui/badge.tsx";
import ActiveScheduleActions from "@/components/table/scheduler/activeSchedule/ActiveScheduleActions.tsx";

const columnHelper = createColumnHelper<ScheduleItem>();

export const columns = [
  columnHelper.accessor('triggerName', {
    header: "Trigger Name",
    cell: props => <span className="font-medium">{props.getValue()}</span>,
    filterFn: "includesString"
  }),
  columnHelper.accessor('jobName', {
    header: "Job Name",
    cell: props => props.getValue(),
    filterFn: "includesString",
  }),
  columnHelper.accessor('triggerType', {
    header: "Type",
    cell: props => <Badge variant="outline">{props.getValue()}</Badge>
  }),
  columnHelper.accessor('triggerState', {
    header: "State",
    cell: props => {
      const value = props.getValue();
      let color: string;
      switch (value) {
        case "NORMAL":
          color = "bg-green-100 text-green-800"
          break;
        case "PAUSED":
          color = "bg-yellow-100 text-yellow-800"
          break;
        default:
          color = "bg-red-100 text-red-800"
      }
      return <Badge className={`hover:bg-opacity-80 ${color} border-0`}>{value}</Badge>
    }
  }),
  columnHelper.accessor('nextFireTime', {
    header: "Next Fire Time",
    cell: props => {
      const nextFireTime = props.getValue();
      return nextFireTime ? new Date(nextFireTime).toLocaleString() : "-";
    }
  }),
  columnHelper.display({
    header: "Actions",
    cell: props => <ActiveScheduleActions row={props.row.original} />
  })
]