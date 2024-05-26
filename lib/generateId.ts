import { customAlphabet } from 'nanoid'


export const generateSerialNumber = (prefix:string, suffix:string, length:number) =>
{
    
    const nanoid = customAlphabet( '0123456789', length );
    const core = nanoid()
    return `${prefix}/${core}/${suffix}`
}