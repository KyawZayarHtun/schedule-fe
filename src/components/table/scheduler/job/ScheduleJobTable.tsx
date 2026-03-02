import {jobsData} from "@/data/schedule-data.ts";
import type {JobDef} from "@/types/schedule.ts";
import {useState} from "react";
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import {scheduleJobColumns} from "@/components/table/scheduler/job/ScheduleJobColumns.tsx";
import {useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {columns} from "@/components/table/scheduler/activeSchedule/ActiveScheduleColumns.tsx";
import {DataTablePagination} from "@/components/table/DataTablePagination.tsx";

const ScheduleJobTable = () => {
    const data: JobDef[] = jobsData;

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns: scheduleJobColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters
        }
    })

    const {data: jobGroups, isPending, isError} = useQuery({
        queryKey: ['jobGroups'],
        queryFn: async () => {
            const response = await fetch("http://localhost:8080/jobs/groups")
            if (!response.ok) {
                throw new Error("Failed to fetch job groups");
            }
            return response.json();
        },
        staleTime: 30 * 1000,
        retry: false,
    })

    if (isPending) {
        return (<span>Loading</span>)
    }

    return (
        <section className="space-y-4">
            {/* Filters */}
            <section className="flex flex-col gap-4 md:flex-row">
                <Input
                    placeholder="Filter Job name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {
                    !isError && (
                        <Select
                            value={(table.getColumn("group")?.getFilterValue() as string) ?? "all"}
                            onValueChange={(value) =>
                                table.getColumn("group")?.setFilterValue(value === "all" ? undefined : value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Job Name"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jobs</SelectItem>
                                {jobGroups.map((gpName: string) => (
                                    <SelectItem key={gpName} value={gpName}>{gpName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                }
            </section>
            <Table className="rounded-sm border">
                <TableHeader>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>{
                                            header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }</TableHead>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableHeader>
                <TableBody>
                    {
                        table.getRowModel().rows.length
                            ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state>
                                        {
                                            row.getVisibleCells().map(cell => {

                                                return (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                ))
                            )
                            : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                    }

                </TableBody>
            </Table>
            {/* --- Pagination --- */}
            <DataTablePagination table={table} />
        </section>
    );
};

export default ScheduleJobTable;