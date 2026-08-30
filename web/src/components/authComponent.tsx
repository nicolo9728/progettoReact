import { useUser } from "../hooks/userHook"

type AuthComponentProps = {
    ruoli?: string[],
    children: any
}

export const AuthComponent = (props: AuthComponentProps)=>{
    const {user} = useUser()

    if(user == null)
        return <></>
    
    if(props.ruoli == null)
        return props.children


    if(props.ruoli?.includes(user?.ruolo ?? ""))
        return props.children
    else
        return <></>
}