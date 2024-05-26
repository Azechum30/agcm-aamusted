
import { create } from 'zustand'
type OpenState = {
    isOpen: boolean,
    setIsOpen: (open:boolean) => void,
    onClose: ()=> void
    
}


const useCreateForm = create<OpenState>(( set ) => ({
    isOpen: false,
    setIsOpen: ()=> set({isOpen: true}),
    onClose: () => set({isOpen: false})
}));


export default useCreateForm