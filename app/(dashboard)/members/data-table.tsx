'use client'
import
    {
        flexRender,
        useReactTable,
        getCoreRowModel,
        SortingState,
        getSortedRowModel,
        RowSelectionState,
        getPaginationRowModel,
        Row,
        ColumnDef
    } from "@tanstack/react-table"
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import { useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, LayoutGrid,  Trash2, Upload } from "lucide-react";
import Search from '@/components/Search'
import { useConfirmBulkDelete } from "@/app/hooks/use-confirm-bulk-delete";
import { exportToExcel } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOpenBulkCreateMembersSheet } from "@/app/hooks/use-open-bulk-create-members-sheet";


type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    pageIndex: number,
    pageSize: number,
    pageCount: number,
    setPageIndex: (pageIndex: number) => void,
    setPageSize: (pageSize: number)=> void,
    onDelete: ( rows: Row<TData>[] ) => void,
    disabled: boolean
}


function MembersDataTable <TData, TValue>({columns, data, pageIndex, pageSize, setPageIndex, setPageSize, pageCount, disabled, onDelete}:DataTableProps<TData, TValue>)
{
    const [BulkDeleteDialog, confirm] = useConfirmBulkDelete(
        "Are you sure?",
        "You are about to perform a bulk delete. Please be informed that this would permanently remove those members from your system. Click 'Cancel' to abort the process or 'Confirm' to continue "
    )

    const {onOpen} = useOpenBulkCreateMembersSheet()

    const [ sorting, setSorting ] = useState<SortingState>( [] )
    const [ rowSelection, setRowSelection ] = useState<RowSelectionState>( {} )
    const table = useReactTable( {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onPaginationChange:  paginationState  =>
        {
            const newState = typeof paginationState ===  'function' ? paginationState({pageIndex, pageSize}): paginationState
            setPageIndex( newState.pageIndex )
            setPageSize(newState.pageSize)
        },
        state: {
            sorting,
            rowSelection,
            pagination: {pageIndex, pageSize}
        },
        manualPagination: true,
        pageCount
    
    } );


    
  return (
      <div className='pt-5'>
          <BulkDeleteDialog />
          <div className="flex flex-col-reverse md:flex-row gap-3 md:items-center mb-2">
              <div className=" w-full md:w-auto">
                  <Select
                      value={ `${ pageSize }` }
                      onValueChange={value => setPageSize(Number(value))}
                  >
                      <SelectTrigger className="focus-visible:ring-0 focus-within:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder='Select number of rows' />
                      </SelectTrigger>
                      <SelectContent align='center'>
                          <SelectItem value="10">Show 10 rows</SelectItem>
                          <SelectItem value="25">Show 25 rows</SelectItem>
                          <SelectItem value="50">Show 50 rows</SelectItem>
                          <SelectItem value="75">Show 75 rows</SelectItem>
                          <SelectItem value="100">Show 100 rows</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant='outline' className='w-full md:w-auto md:mr-auto'>
                              <LayoutGrid className="w-4 h-4 mr-1" />
                              Columns
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                          { table.getAllColumns().map( column => (
                              <DropdownMenuCheckboxItem
                                  key={ column.id }
                                  checked={ column.getIsVisible() }
                                  onCheckedChange={(value)=>column.toggleVisibility(value!!)}
                              >
                                  {column.id}
                              </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                  </DropdownMenu>
              
              <Search />
              <div>
                  <Button onClick={onOpen} variant={'default'} className='w-full md:w-auto'>
                      <Upload className='size-4 mr-1' />
                      Upload CSV
                  </Button>
              </div>
              <div>
                  <Button disabled={data?.length === 0} onClick={()=>exportToExcel(data)} variant={'default'} className='w-full md:w-auto'>
                      <Download className='size-4 mr-1' />
                      Excel
                  </Button>
              </div>
              <div className="w-full md:w-auto">
                  { 
                      table.getSelectedRowModel().rows ? (
                          table.getSelectedRowModel().rows.length > 0 &&
                      <Button
                          size='sm'
                                  disabled={ disabled }
                                  className="w-full"
                          onClick={ async() =>
                          {
                              const ok = await confirm()
                            
                              if ( ok ) {   
                                onDelete( table.getFilteredSelectedRowModel().rows );
                                table.resetRowSelection();
                            }
                          }
                        }
                      >
                          <Trash2 className="size-4 mr-2" />
                          Delete ({table.getSelectedRowModel().rows.length})
                      </Button>
                      ): null
                   }
              </div>
          </div>
          <div id="my-table" className="border rounded-md overflow-x-auto w-full lg:overflow-hidden">
            <Table>
              <TableHeader>
                  { table.getHeaderGroups().map( headerGroups => (
                      <TableRow key={ headerGroups.id }>
                          { headerGroups.headers.map( header => (
                              <TableHead key={ header.id } className="text-center">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                          ))}
                      </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                  { table.getRowModel().rows ? (
                      table.getRowModel().rows.map( row => (
                          <TableRow key={ row.id } className="text-center even:bg-green-100/25 odd:bg-red-100/25">
                              { row.getVisibleCells().map( cell => (
                                  <TableCell key={ cell.id }>
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </TableCell>
                              ))}
                      </TableRow>
                  ))
                  ):
                      <TableRow>
                          <TableCell>No Rows Found!</TableCell>
                  </TableRow>}
              </TableBody>
          </Table>
          </div>
          <div className="flex flex-row justify-between items-center mt-3">
              <div className="text-muted-foreground text-xs">
                  { table.getSelectedRowModel().rows.length } of {' '}
                  {table.getRowModel().rows.length } row(s) is selected
              </div>
          <div className='flex gap-2 items-center'>
                  <Button
                      variant='outline'
                      size='sm'
                      className="text-xs"
                      disabled={ !table.getCanPreviousPage() }
                      onClick={()=>table.previousPage()}
                  >
                  Previous
              </Button>
                  <Button
                      variant='outline'
                      size='sm'
                      className='text-xs'
                      disabled={ !table.getCanNextPage() }
                      onClick={()=> table.nextPage()}
                  >
                  Next
              </Button>
          </div>
          </div>
      </div>
  )
}

export default MembersDataTable
