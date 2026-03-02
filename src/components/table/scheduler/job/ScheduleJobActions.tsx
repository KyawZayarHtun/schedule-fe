import type {JobDef} from "@/types/schedule.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, MoreHorizontal, Pause, Play, Trash2} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";

type JobActionsType = "RESUME" | "PAUSE" | "DELETE" | null;


const ScheduleJobActions = ({job}: { job: JobDef }) => {

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const handleViewDetailToggle = () => {
        setIsSheetOpen(prevState => !prevState);
    }

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [jobActionType, setJobActionType] = useState<JobActionsType>(null);
    const openConfirmationBox = (action: JobActionsType) => {
        setIsAlertOpen(true);
        setJobActionType(action);
    }


    return (
        <>
            {/* 1. Dropdown Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                        <Eye className="mr-2 h-4 w-4"/> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => openConfirmationBox("RESUME")}>
                        <Play className="mr-2 h-4 w-4 text-green-600"/> Resume
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openConfirmationBox("PAUSE")}>
                        <Pause className="mr-2 h-4 w-4 text-orange-600"/> Pause
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openConfirmationBox("DELETE")} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ViewDetails job={job} isViewDetail={isSheetOpen} onToggle={handleViewDetailToggle} />

            {/* 3. Confirmation Dialog */}
            <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="capitalize">Confirm {jobActionType}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to <strong>{jobActionType}</strong> the job "{job.name}" in group "{job.group}"?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAlertOpen(false)}>Cancel</Button>
                        <Button
                            variant={jobActionType === "DELETE" ? "destructive" : "default"}
                            onClick={() => {
                                handleJobAction({
                                    actionType: jobActionType,
                                    jobName: job.name,
                                    jobGroup: job.group
                                })
                                setIsAlertOpen(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
interface DetailProps {
    job: JobDef;
    isViewDetail: boolean;
    onToggle: () => void;
}
function ViewDetails({job, isViewDetail, onToggle}: DetailProps) {
    return (
        <Sheet open={isViewDetail} onOpenChange={onToggle}>
            <SheetContent className="sm:max-w-135 w-full">
                <SheetHeader className="">
                    <SheetTitle className="text-xl flex items-center gap-2">
                        {job.name}
                        <Badge variant="outline" className="font-mono text-[10px]">
                            {job.group}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{job.description}</SheetDescription>
                </SheetHeader>

                <div className="space-y-4 p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Input Parameters Schema
                    </h4>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-37.5">Parameter</TableHead>
                                    <TableHead className="w-25">Type</TableHead>
                                    <TableHead>Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {job.expectedJobDataParameters.length > 0 ? (
                                    job.expectedJobDataParameters.map((param) => (
                                        <TableRow key={param.name}>
                                            <TableCell className="font-mono text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span>{param.name}</span>
                                                    {param.required && (
                                                        <span
                                                            className="text-[10px] text-destructive font-sans font-medium">
                        * Required
                      </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-mono text-[11px]">
                                                    {param.array ? "string[]" : "string"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {param.description}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                            No parameters required for this job.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 p-3 bg-slate-950 rounded-lg">
                        <p className="text-[10px] font-mono text-slate-400 mb-2 uppercase">Payload Example</p>
                        <pre className="text-xs text-blue-300 font-mono overflow-x-auto">
        {JSON.stringify(
            Object.fromEntries(
                job.expectedJobDataParameters.map(p => [p.name, p.array ? ["value"] : "value"])
            ),
            null,
            2
        )}
      </pre>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}


interface JobActionsProps {
    actionType: JobActionsType;
    jobName: string;
    jobGroup: string;
}

function handleJobAction(props: JobActionsProps) {
    console.log("Trigger Type", props.actionType);
    console.log("Trigger Name", props.jobName)
    console.log("Trigger Group", props.jobGroup);

    return (
        <>
        </>
    )
}
export default ScheduleJobActions;