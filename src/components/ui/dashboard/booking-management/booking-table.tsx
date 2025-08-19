"use client";

import { Badge } from "@/primitives/badge";
import { Button } from "@/primitives/button";
import { Card } from "@/primitives/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/primitives/dropdown";
import { Input } from "@/primitives/input";
import { ScrollArea } from "@/primitives/scrollarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/primitives/table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Trash2 } from "lucide-react";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/primitives/dialouge";
import { toast } from "sonner";

interface Booking {
  customerId: string;
  endTime: string;
  fromPincode: string;
  startTime: string;
  toPincode: string;
  vehicleId: string;
  _id: string;
}

// interface BookingAPIResponse {
//   success: boolean;
//   data: Booking[];
// }
export function BookingTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    React.useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = React.useState<string>("");
  const queryClient = useQueryClient();

  const { data: BookingResponseData } = useQuery({
    queryKey: ["bookingsResponse"],
    queryFn: async () => {
      const response = await fetch("/api/booking");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log("BookingId", bookingId);

      const url = `/api/booking/${bookingId}`;
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      toast.success("Booking deleted successfully !", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
        descriptionClassName: "!text-foreground",
      });
      queryClient.invalidateQueries({ queryKey: ["bookingsResponse"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete booking", {
        className:
          "!bg-background !text-foreground !border !border-secondary-foreground/20",
        descriptionClassName: "!text-foreground",
        description: error.message,
      });
    },
  });

  const handleConfirmDelete = () => {
    deleteMutation.mutate(bookingToDelete);
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "customerId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Customer ID
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">{row.original.customerId}</div>
      ),
    },
    {
      accessorKey: "fromPincode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          From Pincode
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className=" whitespace-nowrap text-start font-medium">
          <Badge>{row.getValue("fromPincode")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "toPincode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          To Pincode
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-start font-medium">
          <Badge className="mr-1">{row.getValue("toPincode")}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setIsDeleteDialogOpen(true);
                      setBookingToDelete(booking._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-background" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border border-secondary-foreground/20 bg-background p-2 text-foreground">
                  Delete booking
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data: BookingResponseData?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <Card className="w-auto bg-secondary/10 p-4">
        <div className="flex items-center justify-between gap-4 py-4">
          <Input
            placeholder="Search vehicle ..."
            value={
              (table.getColumn("customerId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("customerId")
                ?.setFilterValue(event.target.value.trim())
            }
            className="max-w-sm"
          />
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)] w-[80vw] rounded-md border md:w-auto">
          <div className="w-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap px-4 py-2"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="overflow-hidden">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* delete confirmation dialog*/}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[90vw] md:w-[30vw]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete booking ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
