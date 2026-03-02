import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import {MOCK_SCHEDULE_DATA} from "@/data/schedule-data.ts";
import {columns} from "@/components/table/scheduler/activeSchedule/ActiveScheduleColumns.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {DataTablePagination} from "@/components/table/DataTablePagination.tsx";
import {useQuery} from "@tanstack/react-query";

const ActiveScheduleTable = () => {
  const data = MOCK_SCHEDULE_DATA;
  // const jobNames = Array.from(new Set(data.map((item) => item.jobName)));

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    }
  })

  const {data: jobNameList, isPending, isError } = useQuery({
    queryKey: ['jobNames'],
    queryFn: async ():Promise<Array<string>> => {
      const response = await fetch("http://localhost:8080/jobs/names")
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json()
    },
    staleTime: 30 * 1000,
    retry: false,
  });

  if (isPending) {
    return (<span>Loading</span>)
  }



  return (
    <section className="space-y-4">
      {/*  Filter */}
      <section className="flex flex-col gap-4 md:flex-row">
        {/* Filter: Trigger Name (Text Input) */}
        <Input
          placeholder="Filter trigger name..."
          value={(table.getColumn("triggerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("triggerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* Filter: Job Name (Dropdown) */}
        {
          !isError &&  <div className="">
            <Select
              value={(table.getColumn("jobName")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("jobName")?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Job Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobNameList.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }

        {/* Filter: Trigger Type (Dropdown) - NEW */}
        <div className="">
          <Select
            value={(table.getColumn("triggerType")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("triggerType")?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Cron">Cron</SelectItem>
              <SelectItem value="Simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

export default ActiveScheduleTable;