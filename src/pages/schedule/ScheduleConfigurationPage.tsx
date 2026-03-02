import ScheduleConfigForm from "@/components/form/ScheduleConfigForm.tsx";
import type {ScheduleConfigRequestWithScheduleType} from "@/types/schedule.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

const ScheduleConfigurationPage = () => {

    const handleFormSubmit = (data: ScheduleConfigRequestWithScheduleType) => {
        console.log("handleFormSubmit", data);
    }

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <ScheduleConfigForm onSubmit={handleFormSubmit}/>
            </QueryClientProvider>
        </div>
    );
};

export default ScheduleConfigurationPage;