import ErrorPage from "@/layout/errorPage";
import Layout from "@/layout/layout";
import JiraBranchCreator from "@/pages/jira-branch-creator";
import WeeklyReportGenerator from "@/pages/weekly-report-generator";
import { GitBranch, LucideCalendarFold } from "lucide-react";
import { createBrowserRouter } from "react-router-dom";

export const browserRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/jira-branch-creator',
                element: <JiraBranchCreator />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/weekly-report-generator',
                element: <WeeklyReportGenerator />,
                errorElement: <ErrorPage />,
            }
        ]
    },
    {
        path: '*',
        element: <ErrorPage />,
    }
], {
    basename: '/simple-apps/',
})

export const routes = [
    {
        path: '/jira-branch-creator',
        name: 'Jira Branch Creator',
        icon: <GitBranch className="h-5 w-5" />,
    },
    {
        path: '/weekly-report-generator',
        name: 'Weekly Report Generator',
        icon: <LucideCalendarFold className="h-5 w-5" />,
    }
]