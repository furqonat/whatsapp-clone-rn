import { useEffect, useState } from 'react'

export * from './user'
export * from './chats'
export * from './transaction'
export * from './calls'


const useChangeRoute = () => {

    const [route, setRoute] = useState('')


    useEffect(() => {

    }, [])

    const changeRoute = (route: string) => {
        setRoute(route)
    }

    return {
        route,
        changeRoute
    }
}

export { useChangeRoute }