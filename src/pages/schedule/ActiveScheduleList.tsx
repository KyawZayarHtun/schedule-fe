import ActiveScheduleTable from "@/components/table/scheduler/activeSchedule/ActiveScheduleTable.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

const ActiveScheduleList = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-5">Active Schedules</h1>
      <QueryClientProvider client={queryClient}>
        <ActiveScheduleTable />
      </QueryClientProvider>
    </div>
  );
};

export default ActiveScheduleList;