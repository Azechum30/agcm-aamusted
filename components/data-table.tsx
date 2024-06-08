import { flexRender, ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'


type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

function DataTable<TData, TValue> ({columns, data}:DataTableProps<TData, TValue>)
{
    const table = useReactTable( {
        columns,
        data,
        getCoreRowModel: getCoreRowModel()
    } )
    
    return (
        <div className='border rounded-md overflow-auto'>
            <Table>
                <TableHeader>
                    { table.getHeaderGroups().map( headerGroups => (
                        <TableRow key={ headerGroups.id } className='bg-slate-200'>
                            { headerGroups.headers.map( header => (
                                <TableHead key={ header.id }>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    { table.getRowModel().rows ? (
                        table.getRowModel().rows.map( row => (
                            <TableRow key={ row.id }>
                                { row.getVisibleCells().map( cell => (
                                    <TableCell key={ cell.id }>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                          </TableRow>
                      ))
                    ): (
                        <TableCell>No Rows Found</TableCell>
                    )}
                </TableBody>
            </Table>
        </div>
    )
    
}

export default DataTable