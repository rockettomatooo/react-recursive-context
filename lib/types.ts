export type RecursiveContextSource = 'config' | 'context' | 'non-existent'

export type RecursiveContextStateObject<TProps> = {
    props: TProps
    ctxProps: TProps
    setProps: (config: TProps) => void
    setCtxProps: (config: TProps) => void
    isCtxReal: boolean
    isReal: boolean
}

export type RecursiveContextApiFn<TProps> = (state: RecursiveContextStateObject<TProps>, ...args: any[]) => any

export type RecursiveContextApiPureArgs<TFn extends RecursiveContextApiFn<any>> = TFn extends (
    state: RecursiveContextStateObject<any>,
    ...args: infer TArgs
) => void
    ? TArgs
    : never

export type RecursiveContextApiReturnType<TFn extends RecursiveContextApiFn<any>> = TFn extends (
    state: RecursiveContextStateObject<any>,
    ...args: any[]
) => infer TReturn
    ? TReturn
    : never

export type RecursiveContextApiObject<TProps> = {
    [key: string]: RecursiveContextApiFn<TProps>
}

export type RecursiveContextPublicApi<TProps, TAPI extends RecursiveContextApiObject<TProps>> = {
    [key in keyof TAPI]: (...args: RecursiveContextApiPureArgs<TAPI[key]>) => RecursiveContextApiReturnType<TAPI[key]>
}

export type RecursiveContextContextProps<TProps, TAPI extends RecursiveContextApiObject<TProps>> = {
    props: TProps
    setProps: (config: TProps) => void
    api: RecursiveContextPublicApi<TProps, TAPI>
    isRealContext: boolean
}
