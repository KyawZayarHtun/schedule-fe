import ScheduleConfigForm from "@/components/form/ScheduleConfigForm.tsx";
import type {ScheduleConfigRequestWithScheduleType} from "@/types/schedule.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner.tsx";
import type {AxiosError} from "axios";
import {useCreateSchedule} from "@/hooks/queries/useScheduleMutations.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router";

const queryClient = new QueryClient();


const ScheduleConfigurationPage = () => {

    const {mutate: createSchedule, isError, error} = useCreateSchedule();
    const navigate = useNavigate();



    const handleFormSubmit = (data: ScheduleConfigRequestWithScheduleType) => {
        console.log("handleFormSubmit", data);

        createSchedule(data, {
            onSuccess: () => {
                toast.success("Schedule has been created successfully.", {
                    position: "bottom-right",
                })
                navigate('/active-schedules');
            },
            onError: (err: AxiosError<string>) => {
                const errorMessage = JSON.stringify(err.response?.data);
                console.log(errorMessage)
                toast.error(errorMessage, {
                    position: "bottom-right",
                })
            }
        })

    }

    if (isError) {
        return <div>Error: {error?.response?.data}</div>;
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