import { ColumnDef } from '@tanstack/react-table'

type table = {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    gender: string,
    email: string,
    phoneNumber: string,
    department: string,
    hostel: string,
    hometown: string,
    entryYear: string,
    serialNumber: string
}

export const headers = [
    {
        header: 'Serial Number',
        accessorKey: 'serialNumber'
    },
    {
        header: 'First Name',
        accessorKey: 'firstName'
    },
    {
        header: 'Last Name',
        accessorKey: 'lastName'
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
        header: 'Email',
        accessorKey: 'email'
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
        header: 'Entry Year',
        accessorKey: 'entryYear'
    },
    {
        header: 'Hostel/Hall',
        accessorKey: 'hostel'
    },
    

] satisfies ColumnDef<table>[]