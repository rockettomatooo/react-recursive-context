import { useRef } from 'react'

export const useCurrentRef = <T,>(value: T) => {
    const ref = useRef(value)
    ref.current = value
    return ref
}
