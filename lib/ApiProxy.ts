import { RecursiveContextApiObject, RecursiveContextApiPureArgs, RecursiveContextPublicApi } from './types'

type APIProxyOptions<TData> = {
    propsRef: React.MutableRefObject<TData>
    ctxPropsRef: React.MutableRefObject<TData>
    setProps: (config: TData) => void
    setCtxProps: (config: TData) => void
    isCtxRealRef: React.MutableRefObject<boolean>
    isRealRef: React.MutableRefObject<boolean>
}

export function createAPIProxy<TPRops, TApi extends RecursiveContextApiObject<TPRops>>(
    api: TApi,
    options: APIProxyOptions<TPRops>
) {
    const { propsRef, ctxPropsRef, setProps, setCtxProps, isCtxRealRef, isRealRef } = options

    const apiProxy = new Proxy(api, {
        get(target, prop) {
            if (typeof prop === 'string') {
                const fn = target[prop as keyof typeof target]
                if (typeof fn === 'function') {
                    return (...args: RecursiveContextApiPureArgs<typeof fn>) =>
                        fn.apply(target, [
                            {
                                props: propsRef.current,
                                ctxProps: ctxPropsRef.current,
                                setProps,
                                setCtxProps,
                                isCtxReal: isCtxRealRef.current,
                                isReal: isRealRef.current,
                            },
                            ...args,
                        ])
                }
            }
        },
    }) as unknown as RecursiveContextPublicApi<TPRops, TApi>

    return apiProxy
}
