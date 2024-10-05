import { Menu, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Link, useLocation } from "react-router-dom"
import { routes } from "@/config/routes"
import { CommonCtx } from "@/config/commonCtxProvider"
import { useContext } from "react"

export default function Header() {
    const location = useLocation();
    const { appTitle } = useContext(CommonCtx);

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-slate-100/40 px-4 lg:h-[60px] lg:px-6 dark:bg-slate-800/40">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="flex flex-col">
                    <SheetTitle>
                        <Link
                            to="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Rocket className="h-6 w-6" />
                            <span className="font-black">{appTitle}</span>
                        </Link>
                    </SheetTitle>
                    <nav className="grid gap-2 text-lg font-medium py-4">

                        {routes.map((route, index) => (
                            <Link
                                key={index}
                                to={route.path}
                                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50 text-slate-600 ${location.pathname === route.path ? 'bg-slate-200' : ''}`}
                            >
                                {route.icon}
                                {route.name}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </header >
    )
}