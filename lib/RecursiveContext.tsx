import React, { useState } from 'react'
import { RecursiveContextApiObject, RecursiveContextContextProps } from './types'
import { createAPIProxy } from './ApiProxy'
import { useControllableState } from './hooks/useControllableState'
import { useCurrentRef } from './hooks/useCurrentRef'

type RecursiveContextProps<TProps extends object> = TProps & {
    onChange?: (props: TProps) => void
    children: React.ReactNode
}

export function createRecursiveContext<
    TProps extends object,
    TApi extends RecursiveContextApiObject<TProps> = RecursiveContextApiObject<TProps>
>(defaultProps: TProps, api: TApi) {
    const Context = React.createContext<RecursiveContextContextProps<TProps, TApi>>({
        props: defaultProps,
        setProps: () => {},
        api: createAPIProxy(api, {
            propsRef: { current: defaultProps },
            setProps: () => {},
            ctxPropsRef: { current: defaultProps },
            setCtxProps: () => {},
            isRealRef: { current: false },
            isCtxRealRef: { current: false },
        }),
        isRealContext: false,
    })

    const useInternalRecursiveContext = () => React.useContext(Context)

    function RecursiveContext({ children, onChange, ...props }: RecursiveContextProps<TProps>) {
        const [propsState, setProps] = useControllableState<TProps>({
            prop: Object.keys(props).length ? (props as TProps) : undefined,
            defaultProp: defaultProps,
            onChange,
        })

        const context = useInternalRecursiveContext()
        const ctxProps = context.props
        const setCtxProps = context.setProps

        const completedProps = { ...defaultProps, ...propsState }

        const propsRef = useCurrentRef<TProps>(completedProps)
        const isRealRef = useCurrentRef(true)
        const ctxPropsRef = useCurrentRef(ctxProps)
        const isCtxRealRef = useCurrentRef(context.isRealContext)

        const [apiProxy] = useState(() =>
            createAPIProxy<TProps, TApi>(api, {
                propsRef,
                ctxPropsRef,
                setProps,
                setCtxProps,
                isCtxRealRef,
                isRealRef,
            })
        )

        return (
            <Context.Provider
                value={{
                    props: completedProps,
                    setProps,
                    api: apiProxy,
                    isRealContext: true,
                }}
            >
                {children}
            </Context.Provider>
        )
    }

    const useRecursiveContext = () => {
        const ctx = React.useContext(Context)
        const { props, setProps, api } = ctx

        return [api, props, setProps] as const
    }

    return [RecursiveContext, useRecursiveContext] as const
}
