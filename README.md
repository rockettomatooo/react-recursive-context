# react-recursive-context

## Usage

```tsx
import { createRecursiveContext } from 'react-recursive-context'

type MyRecursiveContextProps = { 
    value?: number
}

const [Provider, useProvider] = createRecursiveContext<MyRecursiveContextProps>({value: 0}, {
    getValue: (state) => state.props.value ?? state.ctxProps.value
    setValue: (state, value: number) => state.setProps({ value: 0 })
})



function MyConsumerComponent() {
    const [api] = useProvider()

    return (
        <>
            {api.getValue()}
            <button onClick={() => api.setValue(2)}>Update</button>
        <>
    )
}


ReactDOM.render(
    <Provider>
        <MyConsumerComponent />
    </Provider>
)