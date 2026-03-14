import ScheduleConfigForm from "@/components/form/ScheduleConfigForm.tsx";
import type {ScheduleConfigRequestWithScheduleType} from "@/types/schedule.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner.tsx";
import {toast} from "sonner";

const queryClient = new QueryClient();

const ScheduleConfigurationPage = () => {

    const handleFormSubmit = (data: ScheduleConfigRequestWithScheduleType) => {
        console.log("handleFormSubmit", data);
        toast("Schedule has been created successfully.", {
            position: "bottom-right",
        })
    }

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <ScheduleConfigForm onSubmit={handleFormSubmit}/>
                <Toaster />
            </QueryClientProvider>
        </div>
    );
};

export default ScheduleConfigurationPage;