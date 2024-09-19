import
    {
        ColumnDef,
        flexRender,
        useReactTable,
        getCoreRowModel,
        VisibilityState,
        SortingState,
        getSortedRowModel
    } from '@tanstack/react-table'
import {Table, TableBody, TableCell, TableRow, TableHeader, TableHead} from '@/components/ui/table'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { LayoutDashboard } from 'lucide-react'

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}



function TithesDataTable<TData, TValue> ( { columns, data }: DataTableProps<TData, TValue> )
{
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>( {} )
    const [sorting, setSorting] = useState<SortingState>([])
    
    const table = useReactTable( {
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        state: {
            columnVisibility,
            sorting
        }
    })
  return (
      <div>
          <div className='flex flex-col md:flex-row gap-3 items-center'>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button className=''>
                          <LayoutDashboard className='size-4 mr-1' />
                          Columns
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='center'>
                    { table.getAllColumns().filter(column => column.getCanHide()).map( column => (
                        <DropdownMenuCheckboxItem
                            key={ column.id }
                            checked={ column.getIsVisible()}
                            onCheckedChange={(value)=>column.toggleVisibility(!!value)}
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
          </div>

          <div className='border mt-6 rounded-md'>
          <Table>
              <TableHeader>
                  { table.getHeaderGroups().map( headerGroups => (
                      <TableRow key={ headerGroups.id } className='bg-gray-100'>
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
                  ) : (
                          <TableRow>
                              <TableCell>No Rows found!</TableCell>
                          </TableRow>
                  )}
              </TableBody>
            </Table>
        </div>
    </div>
  )
}

export default TithesDataTable
