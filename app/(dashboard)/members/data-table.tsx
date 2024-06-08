'use client'
import
    {
        flexRender,
        useReactTable,
        getCoreRowModel,
        SortingState,
        getSortedRowModel,
        RowSelectionState,
        PaginationState,
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

import {  useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutGrid,  Trash2, Upload } from "lucide-react";
import Search from '@/components/Search'
import { useConfirmBulkDelete } from "@/app/hooks/use-confirm-bulk-delete";
import { useOpenSheet } from "@/app/hooks/use-open-sheet";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    onDelete: ( rows: Row<TData>[] ) => void,
    disabled: boolean
}


function MembersDataTable <TData, TValue>({columns, data, disabled, onDelete}:DataTableProps<TData, TValue>)
{
    const [BulkDeleteDialog, confirm] = useConfirmBulkDelete(
        "Are you sure?",
        "You are about to perform a bulk delete. Please be informed that this would permanently remove those members from your system. Click 'Cancel' to abort the process or 'Confirm' to continue "
    )

    const {onOpen} = useOpenSheet()

    const [ sorting, setSorting ] = useState<SortingState>( [] )
    const [ rowSelection, setRowSelection ] = useState<RowSelectionState>( {} )
    const [ pagination, setPagination ] = useState<PaginationState>( { pageIndex: 0, pageSize: 10 } )
    const table = useReactTable( {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            rowSelection,
            pagination
        }
    
    } );


  return (
      <div>
          <BulkDeleteDialog />
          <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-center mb-2">
              <div className='mr-auto w-full'>
                   <Search />
             </div>
              <div>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
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
              </div> 
              <div>
                  <Button onClick={onOpen} variant={'outline'}>
                      <Upload className='size-4 mr-1' />
                      Upload File
                  </Button>
              </div>
              <>
                  { 
                      table.getSelectedRowModel().rows ? (
                          table.getSelectedRowModel().rows.length > 0 &&
                      <Button
                          size='sm'
                          disabled={ disabled }
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
              </>
          </div>
          <div className="border rounded-md overflow-x-auto w-full lg:overflow-hidden">
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
