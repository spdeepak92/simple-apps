import { PropsWithChildren } from 'react'
import { CommonCtxProvider } from './commonCtxProvider'

export const ContextAPI = ({ children }: PropsWithChildren) => (
    <CommonCtxProvider>
        {children}
    </CommonCtxProvider>
)
