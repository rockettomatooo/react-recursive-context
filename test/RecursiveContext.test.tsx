import React from 'react'
import { vi } from 'vitest'
import { act, render } from '@testing-library/react'

import { createRecursiveContext } from 'lib/RecursiveContext'

type TestContextProps = {
    value?: number
}

const [TestContextProvider, useTestContext] = createRecursiveContext<TestContextProps>(
    { value: 0 },
    {
        get: (state) => state.props,
        getCtx: (state) => state.ctxProps,
        set: (state, value) => {
            console.log(value)
            state.setProps(value)
        },
        setCtx: (state, value) => state.setCtxProps(value),
    }
)

describe('RecursiveConfigContext', () => {
    it('propagates config correctly', () => {
        const TestComponent = () => {
            const [api] = useTestContext()
            return <div>{api.get().value}</div>
        }

        const ui = render(
            <TestContextProvider value={1}>
                <TestComponent />
            </TestContextProvider>
        )
        expect(ui.getByText('1')).toBeInTheDocument()
    })

    it('updates config correctly', () => {
        const TestComponent = () => {
            const [api] = useTestContext()
            return (
                <div>
                    {api.get().value} <button onClick={() => api.set(2)}>Update</button>
                </div>
            )
        }

        const onChangeFn = vi.fn()
        const ui = render(
            <TestContextProvider value={1} onChange={onChangeFn}>
                <TestComponent />
            </TestContextProvider>
        )
        expect(ui.getByText('1')).toBeInTheDocument()
        act(() => {
            ui.getByText('Update').click()
        })
        expect(onChangeFn).toHaveBeenCalledWith(2)
    })

    it('propagates context config correctly', () => {
        const TestComponent = () => {
            const [api] = useTestContext()
            return <div>{api.getCtx().value}</div>
        }

        const ui = render(
            <TestContextProvider value={1}>
                <TestContextProvider>
                    <TestComponent />
                </TestContextProvider>
            </TestContextProvider>
        )
        expect(ui.getByText('1')).toBeInTheDocument()
    })
    it('updates context config correctly', () => {
        const TestComponent = () => {
            const [api] = useTestContext()
            return (
                <div>
                    {api.getCtx().value} <button onClick={() => api.setCtx(2)}>Update</button>
                </div>
            )
        }

        const onChangeFn = vi.fn()
        const ui = render(
            <TestContextProvider value={1} onChange={onChangeFn}>
                <TestContextProvider>
                    <TestComponent />
                </TestContextProvider>
            </TestContextProvider>
        )
        expect(ui.getByText('1')).toBeInTheDocument()
        act(() => {
            ui.getByText('Update').click()
        })
        expect(onChangeFn).toHaveBeenCalledWith(2)
    })

    it('propagates with default values', async () => {
        const TestComponent = () => {
            const [api] = useTestContext()
            return (
                <div>
                    {api.get().value} <button onClick={() => api.set({ value: 2 })}>Update</button>
                </div>
            )
        }

        const ui = render(
            <TestContextProvider>
                <TestComponent />
            </TestContextProvider>
        )
        expect(ui.getByText('0')).toBeInTheDocument()
        act(() => {
            ui.getByText('Update').click()
        })
        expect(ui.getByText('2')).toBeInTheDocument()
    })
})
