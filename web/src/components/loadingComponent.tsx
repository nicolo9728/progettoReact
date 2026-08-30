type LoadingComponentProps = Readonly<{
    value?: any,
    children: any
}>

export const LoadingComponent = ({value, children}: LoadingComponentProps)=>(
    <>
        {value ? children : <div><h1>Caricamento</h1></div>}
    </>
)