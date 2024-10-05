import { Dispatch, SetStateAction, PropsWithChildren, useState, useMemo, createContext } from "react"

// SETTER TYPE DECLARATIONS
type SetBoolean = Dispatch<SetStateAction<boolean>>
type SetString = Dispatch<SetStateAction<string>>

// UPDATE FUNCTION DECLARATIONS
const UpdateBoolean: SetBoolean = () => false
const UpdateString: SetString = () => ""

// CONTEXT VARIABLES
export const CommonCtx = createContext({
    // open and close add user sidebar
    showSideBar: false,
    setShowSideBar: UpdateBoolean,

    // App title
    appTitle: "Simple Apps",
    setAppTitle: UpdateString,
})

// NOTE: "CONTEXT VARIABLE" AND "STATE VARIABLE" NAMES SHOULD BE IDENTICAL
export const CommonCtxProvider = ({ children }: PropsWithChildren) => {
    // STATE VARIABLES
    const [showSideBar, setShowSideBar] = useState(false)
    const [appTitle, setAppTitle] = useState("Simple Apps")

    // CONTEXT PROVIDER
    return (
        <CommonCtx.Provider
            value={useMemo(() => {
                return {
                    showSideBar,
                    setShowSideBar,
                    appTitle,
                    setAppTitle,
                }
            }, [showSideBar, appTitle])}
        >
            {children}
        </CommonCtx.Provider>
    )
}
