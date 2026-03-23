import ScheduleConfigForm from "@/components/form/ScheduleConfigForm.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner.tsx";

const queryClient = new QueryClient();


const ScheduleConfigurationPage = () => {

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <ScheduleConfigForm/>
                <Toaster />
            </QueryClientProvider>
        </div>
    );
};

export default ScheduleConfigurationPage;