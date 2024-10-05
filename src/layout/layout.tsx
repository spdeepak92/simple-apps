import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-slate-100/40 md:block dark:bg-slate-800/40">
                <Sidebar />
            </div>
            <div className="flex flex-col">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <div
                        className="p-5 flex rounded-lg border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-200"
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}