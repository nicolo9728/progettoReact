import { useUser } from "../hooks/userHook"

type AuthComponentProps = {
    ruoli?: string[],
    anonimo?: boolean
    children: any
}

export const AuthComponent = (props: AuthComponentProps)=>{
    const {user} = useUser()
    if(!user && !props.anonimo)
        return <></>
    
    if(!user && props.anonimo)
        return props.children

    if(props.ruoli == null && !props.anonimo)
        return props.children

    if(props.ruoli?.includes(user?.ruolo ?? "") && !props.anonimo)
        return props.children
    else
        return <></>
}