import validator from 'validator'
import * as z from 'zod'


const Genders = [ 'male', 'female' ] as const
const Departments = ['prayer', 'protocol', 'music', 'evangelism'] as const

const genderSchema = z.enum(Genders, {required_error: 'gender can only be male or female'}).optional()

export const MemberSchema = z.object( {
    firstName: z
        .string( { required_error: 'first name is required!' } )
        .regex( new RegExp( '^[a-zA-Z]+$' ), 'no special characters are allowed in first name!' ),
    lastName: z
        .string( { required_error: 'last name is required' } )
        .regex( new RegExp( '^[a-zA-Z]+$' ), 'no special characters are allowed in last name!' ),
    middleName: z.string().optional(),
    gender: genderSchema,
    email: z.string({required_error: 'email is required'}).email(),
    dateOfBirth: z.date( { required_error: "date of birth must be a date" } ),
    phoneNumber: z
        .string({required_error: 'phone number is required!'})
        .refine( validator.isMobilePhone ),
    entryYear: z.string({required_error: 'entry year is a required'}),
    department: z
        .enum( Departments, { required_error: `department can either be one of ${ Departments }` } ).optional(),
    course: z.string( { required_error: 'course is required!' } ),
    hostel: z.string( { required_error: 'You hostel name is required' } ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof( File ).optional(),
    hometown: z.string({required_error: 'home town is required'})

} )


export type MemberType = z.infer<typeof MemberSchema>

export type ColumnDefType = MemberType & {
    serialNumber: string
}