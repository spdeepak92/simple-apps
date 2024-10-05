import { Rocket } from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { routes } from "@/config/routes";
import { useContext } from "react";
import { CommonCtx } from "@/config/commonCtxProvider";

export default function Sidebar() {
    const location = useLocation();
    const { appTitle } = useContext(CommonCtx);

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                    <Rocket className="h-6 w-6" />
                    <span className="">{appTitle}</span>
                </Link>
            </div>

            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {routes.map((route, index) => (
                        <Link
                            key={index}
                            to={route.path}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-md px-3 py-2 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 text-slate-600 ${location.pathname === route.path ? 'bg-slate-200' : ''}`}
                        >
                            {route.icon}
                            {route.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}