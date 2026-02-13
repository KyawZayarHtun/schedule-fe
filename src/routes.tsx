import {createBrowserRouter} from "react-router";
import DashboardLayout from "@/layout/DashboardLayout.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import Home from "@/pages/Home.tsx";
import {Suspense} from "react";
import JobList from "@/pages/schedule/JobList.tsx";
import CreateSimpleSchedule from "@/pages/schedule/CreateSimpleSchedule.tsx";
import ActiveScheduleList from "@/pages/schedule/ActiveScheduleList.tsx";

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: '/jobs',
        element: (
          <Suspense fallback={<div>Loading page...</div>}>
            <JobList />
          </Suspense>
        )
      },
      {
        path: '/simple',
        Component: CreateSimpleSchedule
      },
      {
        path: '/active-schedules',
        Component: ActiveScheduleList
      },
    ]

  }
])