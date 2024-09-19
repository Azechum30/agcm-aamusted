import { create } from 'zustand'

type Props = {
    id?: string,
    isOpen: boolean,
    onOpen: (id: string) => void
    onClose: ()=> void
}

export const useEditTitheHook = create<Props>( set => ( {
    isOpen: false,
    id: undefined,
    onOpen: ( id: string ) => set( { isOpen: true, id } ),
    onClose: () => set( { isOpen: false, id: undefined } )
}))