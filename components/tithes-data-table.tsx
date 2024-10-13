import
    {
        ColumnDef,
        flexRender,
        useReactTable,
        getCoreRowModel,
        VisibilityState,
        SortingState,
        getSortedRowModel,
        getPaginationRowModel,
        Row
    } from '@tanstack/react-table'
import {Table, TableBody, TableCell, TableRow, TableHeader, TableHead} from '@/components/ui/table'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight, Download, LayoutDashboard, Trash2, Upload } from 'lucide-react'
import { useConfirmBulkDelete } from '@/app/hooks/use-confirm-bulk-delete'
import Search from './Search'
import { useOpenSheet } from '@/app/hooks/use-open-sheet'
import ExportAsXLSX from './export-as-xlsx'
import { useUser } from '@clerk/nextjs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    pageIndex: number,
    pageSize: number,
    pageCount: number
    setPageIndex: (pageIndex: number) => void,
    setPageSize: ( pageSize: number ) => void,
    onDelete: ( rows: Row<TData>[] ) => void,
    disabled: boolean
}



function TithesDataTable<TData, TValue> ( { columns, data, pageIndex, pageSize, setPageIndex, setPageSize, pageCount, onDelete, disabled }: DataTableProps<TData, TValue> )
{
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>( {} )
    const [ sorting, setSorting ] = useState<SortingState>( [] )
    // const [ pagination, setPagination ] = useState<PaginationState>( { pageIndex: 0, pageSize: 10 } )

    
    
    const table = useReactTable( {
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: updater =>
        {
            const newState = typeof updater === 'function' ? updater( { pageIndex, pageSize } ) : updater
            setPageIndex( newState.pageIndex )
            setPageSize(newState.pageSize)
        },
        onSortingChange: setSorting,
        state: {
            columnVisibility,
            sorting,
            pagination: {pageIndex, pageSize}
        },
        pageCount,
        manualPagination: true
    })
    const [ BulkDeleteDialog, confirm ] = useConfirmBulkDelete( "Are you absolutely sure?", `You are about to permanently remove these selected tithe records. Click on 'Cancel' to terminate the process or 'Confirm' to proceed with the operation.` )
    

    const { onOpen } = useOpenSheet()
    const {user} = useUser()
    const canExportData = user?.organizationMemberships[0]?.role  || ''
    
  return (
      <div>
        <BulkDeleteDialog />
          <div className='flex flex-col-reverse md:flex-row gap-2 items-center mt-4'>
              <div className=' w-full md:w-auto'>
                  <Select value={`${pageSize}`} onValueChange={value=> setPageSize(Number(value))}>
                      <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select No. of rows to show' />
                      </SelectTrigger>
                      <SelectContent align='center'>
                          <SelectItem value='10'>Show 10 rows</SelectItem>
                          <SelectItem value='25'>Show 25 rows</SelectItem>
                          <SelectItem value='50'>Show 50 rows</SelectItem>
                          <SelectItem value='75'>Show 75 rows</SelectItem>
                          <SelectItem value='100'>Show 100 rows</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm' className='w-full md:w-auto md:mr-auto'>
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
              <Search />
              <div className='w-full md:w-auto'>
                  {
                      (table.getSelectedRowModel().rows.length > 0 && canExportData === 'org:admin') ? (
                          <Button
                              variant='destructive'
                              className='w-full md:w-auto'
                              size='sm'
                              onClick={ async () =>
                              {
                                  const ok = await confirm()
                                  if ( ok ) {
                                    onDelete( table.getFilteredSelectedRowModel().rows );
                                    table.resetRowSelection()
                                  }
                              } }
                              disabled={disabled}
                          >
                              <Trash2 className="size-4 mr-1" />
                              Delete ({table.getSelectedRowModel().rows.length})
                          </Button>
                      ): null
                  }
              </div>
              
              {
                  canExportData === 'org:admin' && (
                      <React.Fragment>
                          <div className='w-full md:w-auto'>
                            <Button size='sm' className='w-full' onClick={onOpen}>
                                <Upload className='size-4 mr-1' />
                                Upload Tithes
                            </Button>
                        </div>
                          <ExportAsXLSX data={ data as any } filename='List of Tithes' />
                        </React.Fragment>   
                  )
              }
          </div>

          <div className='border mt-6 rounded-md'>
          <Table>
              <TableHeader>
                  { table.getHeaderGroups().map( headerGroups => (
                      <TableRow key={ headerGroups.id } className='bg-gray-100'>
                          { headerGroups.headers.map( header => (
                              <TableHead key={ header.id } className='text-center'>
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                          ))}
                      </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                  { table.getRowModel().rows ? (
                      table.getRowModel().rows.map( row => (
                          <TableRow key={ row.id } className='text-center even:bg-green-100/25 odd:bg-red-100/25'>
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
              <div className="flex justify-between items-center mt-3">
              <div className='text-muted-foreground text-xs flex items-center gap-2'>
                  <div>
                      Page { pageIndex + 1 } {' '} of  {' '} { pageCount } pages
                  </div>
                  <div className='hidden md:block'>
                      
                      { table.getSelectedRowModel().rows.length } of { ' ' }
                      {table.getRowModel().rows.length} row(s) selected
                  </div>
                  </div>
                  <div className="flex gap-2 items-center">
                      <Button
                          variant='ghost'
                          onClick={ () => table.previousPage() }
                          disabled={!table.getCanPreviousPage()}
                          className='text-xs'
                      >
                          <ChevronLeft className='size-4 mr-1' />
                          Previous
                      </Button>
                      <Button
                          variant='ghost'
                          onClick={ () => table.nextPage() }
                          disabled={!table.getCanNextPage()}
                          className='text-xs'
                      >
                          Next
                          <ChevronRight className='size-4 ml-1' />
                      </Button>
                  </div>
        </div>
    </div>
  )
}

export default TithesDataTable
