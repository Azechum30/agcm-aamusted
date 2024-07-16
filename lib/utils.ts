import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import xlsx, {IJsonSheet, ISettings} from 'json-as-xlsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function exportToExcel (data:any)
{
  const columns: IJsonSheet[] = [
    {
      sheet: 'Members',
      columns: [
        { label: 'Serial Number', value: 'serialNumber' },
        { label: 'First Name', value: 'firstName' },
        { label: 'Middle Name', value: 'middleName' },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Gender', value: 'gender' },
        { label: 'Date of Birth', value: (row)=>new Date(row.dateOfBirth as string).toLocaleDateString() },
        { label: 'Course', value: 'course' },
        { label: 'Year of Enrollment', value: 'entryYear' },
        { label: 'Hostel/Hall', value: 'hostel' },
        { label: 'Department (in Church)', value: 'department' },
        { label: 'Hometown', value: 'hometown' },
        { label: 'Phone Number', value: 'phoneNumber' },
        { label: 'Email', value: 'email' },
        
      ],
      content: data
    },
  ]
  
  const settings:ISettings = {
    fileName: 'Members Excel Data'
  }

  xlsx(columns, settings)
}

export function exportToPDF ()
{
  
}