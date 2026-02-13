import type {ScheduleItem} from "@/types/schedule.ts";
import {Button} from "@/components/ui/button.tsx";
import {Eye, MoreHorizontalIcon, Pause, Play, Trash2} from "lucide-react";
import {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";


type TriggerActionsType = "RESUME" | "PAUSE" | "DELETE" | null;

const ActiveScheduleActions = ({row}: { row: ScheduleItem }) => {
  const [isViewDetail, setIsViewDetail] = useState(false);
  const handleViewDetailToggle = () => {
    setIsViewDetail(!isViewDetail);
  }

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [triggerActionType, setTriggerActionType] = useState<TriggerActionsType>(null);
  const openConfirmationBox = (action: TriggerActionsType) => {
    setIsAlertOpen(true);
    setTriggerActionType(action);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary View Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-blue-600 hover:text-blue-800 cursor-pointer"
        onClick={() => setIsViewDetail(true)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <ViewDetail schedule={row} isViewDetail={isViewDetail} onToggle={handleViewDetailToggle} />

      {/* More Action Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => openConfirmationBox("RESUME")}>
            <Play className="mr-2 h-4 w-4 text-green-600" /> Resume
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openConfirmationBox("PAUSE")}>
            <Pause className="mr-2 h-4 w-4 text-orange-600" /> Pause
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openConfirmationBox("DELETE")}>
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {triggerActionType}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {triggerActionType?.toLowerCase()} the trigger
              <span className="font-bold text-foreground"> {row.triggerName}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlertOpen(false)}>Cancel</Button>
            <Button
              variant={triggerActionType === "DELETE" ? "destructive" : "default"}
              onClick={() => {
                handleTriggerAction({
                  actionType: triggerActionType,
                  triggerName: row.triggerName,
                  triggerGroup: row.triggerGroup
                });
                setIsAlertOpen(false);
                setTriggerActionType(null);
              }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface DetailProps {
  schedule: ScheduleItem;
  isViewDetail: boolean;
  onToggle: () => void;
}

function ViewDetail({schedule, isViewDetail, onToggle}: DetailProps) {
  return (
    <>
      <Dialog open={isViewDetail} onOpenChange={onToggle}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Details: {schedule.triggerName}</DialogTitle>
            <DialogDescription>
              Detailed configuration for {schedule.jobName} ({schedule.jobGroup})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Section 1: Core Status & Type */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-3">
              <div className="space-y-1">
                <h4 className="text-xs font-medium uppercase text-muted-foreground">Trigger State</h4>
                <div className="flex items-center gap-2">
           <span className={`h-2.5 w-2.5 rounded-full ${
             schedule.triggerState === "NORMAL" ? "bg-green-500" :
               schedule.triggerState === "PAUSED" ? "bg-yellow-500" : "bg-red-500"
           }`} />
                  <p className="font-medium">{schedule.triggerState}</p>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-medium uppercase text-muted-foreground">Type</h4>
                <p className="font-medium">{schedule.triggerType}</p>
              </div>
            </div>

            {/* Section 2: Timeline (New Fields Added) */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-1">Execution Timeline</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="block text-xs text-muted-foreground">Start Time</span>
                  <span>{new Date(schedule.startTime).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">End Time</span>
                  <span>{schedule.endTime ? new Date(schedule.endTime).toLocaleString() : "Indefinite"}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Previous Fire Time</span>
                  <span>{schedule.previousFireTime ? new Date(schedule.previousFireTime).toLocaleString() : "Never Fired"}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Next Fire Time</span>
                  <span className="font-medium text-blue-600">
                    {schedule.nextFireTime ? new Date(schedule.nextFireTime).toLocaleString() : "Completed"}
                </span>
                </div>
              </div>
            </div>

            {/* Section 3: Configuration & Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold border-b pb-1">Configuration</h4>

              {/* Description - Now Full Text */}
              <div>
                <span className="block text-xs text-muted-foreground mb-1">Description</span>
                <div className="rounded-md bg-muted p-2 text-sm text-foreground whitespace-normal wrap-break-word">
                  {schedule.jobDescription || "No description provided."}
                </div>
              </div>

              {/* Cron/Interval Details */}
              <div className="rounded-md border p-3 text-sm">
                {schedule.triggerType === "Cron" ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Cron Expression:</span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-900">
                      {schedule.cronExpression}
                    </code>
                  </div>
                ) : (
                  <div className="flex gap-6">
                    <div>
                      <span className="mr-2 text-muted-foreground">Interval:</span>
                      {schedule.simpleTriggerRepeatInterval}ms
                    </div>
                    <div>
                      <span className="mr-2 text-muted-foreground">Count:</span>
                      {schedule.simpleTriggerRepeatCount}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Data Map */}
            <div>
              <h4 className="mb-2 text-sm font-semibold border-b pb-1">Trigger Data Map</h4>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left font-medium text-muted-foreground text-xs uppercase">Key</th>
                    <th className="p-2 text-left font-medium text-muted-foreground text-xs uppercase">Value</th>
                  </tr>
                  </thead>
                  <tbody>
                  {Object.entries(schedule.triggerDataMap).length > 0 ? (
                    Object.entries(schedule.triggerDataMap).map(([key, value]) => (
                      <tr key={key} className="border-t last:border-0">
                        <td className="p-2 font-mono text-xs text-blue-700">{key}</td>
                        <td className="p-2 text-foreground break-all">{value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-2 text-center text-muted-foreground italic">No data map entries</td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface TriggerActionsProps {
  actionType: TriggerActionsType;
  triggerName: string;
  triggerGroup: string;
}

function handleTriggerAction(props: TriggerActionsProps) {
  console.log("Trigger Type", props.actionType);
  console.log("Trigger Group", props.triggerGroup);
  console.log("Trigger Name", props.triggerName)

  return (
    <>
    </>
  )
}
export default ActiveScheduleActions;