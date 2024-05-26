import { create } from 'zustand'


type EditMemberDialogProps = {
    id?: string,
    isOpen: boolean,
    onOpen: (id:string) => void,
    onClose: ()=> void
}

export const useEditMemberDialog = create<EditMemberDialogProps>( set => ( {
    id: undefined,
    isOpen: false,
    onOpen: (id:string) => set( { isOpen: true, id } ),
    onClose: ()=> set({isOpen: false, id: undefined})
}))

