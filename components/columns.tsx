import { ColumnDefType } from '@/app/types/types';
import { ColumnDef } from '@tanstack/react-table';


export type columnsType = Omit<ColumnDefType, 'imageFile' | 'imageUrl' | "serialNumber" | 'dateOfBirth'> & {
    dateOfBirth: string
}
export const columns = [

    {
        header: 'First Name',
        accessorKey: 'firstName'
    },
    {
        header: 'Last Name',
        accessorKey: 'lastName'
    },
    {
        header: 'Middle Name',
        accessorKey: 'middleName'
    },
    {
        header: 'Date of Birth',
        accessorKey: 'dateOfBirth'
    },
    {
        header: 'Gender',
        accessorKey: 'gender'
    },
    {
        header: 'Contact',
        accessorKey: 'phoneNumber'
    },
    {
        header: 'Department',
        accessorKey: 'department'
    },
    {
        header: 'Hometown',
        accessorKey: 'hometown'
    },
    {
        header: 'Email',
        accessorKey: 'email'
    },
    {
        header: 'Hostel',
        accessorKey: 'hostel'
    },
    {
        header: 'Programme',
        accessorKey: 'course'
    },

] satisfies ColumnDef<columnsType>[];
