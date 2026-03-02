import ScheduleJobTable from "@/components/table/scheduler/job/ScheduleJobTable.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

const JobList = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-5">Job Management</h1>
        <QueryClientProvider client={queryClient}>
            <ScheduleJobTable/>
        </QueryClientProvider>
    </div>
  );
};

export default JobList;