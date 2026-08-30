export const getFormData = (form: HTMLFormElement, campiInt: string[] = []) => {
    const formData = new FormData(form)
    const ris = Object.fromEntries(formData.entries()) as Record<string, any>

    campiInt.forEach((campo) => {
        if (campo in ris) {
            const val = ris[campo];
            ris[campo] = val !== '' ? parseInt(val as string, 10) : null;
        }
    });
    return ris
}