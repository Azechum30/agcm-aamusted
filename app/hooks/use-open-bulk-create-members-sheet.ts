import { create } from 'zustand'

type TMemberUploadProps = {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}

export const useOpenBulkCreateMembersSheet = create<TMemberUploadProps>( set => ( {
    isOpen: false,
    onOpen: () => set( { isOpen: true } ),
    onClose: () => set( { isOpen: false } )
}))