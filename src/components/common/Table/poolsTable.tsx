import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "./loadingState";
import { Input } from "@/components/ui/input";
import { Search, User, X } from "lucide-react";
import { cn } from "@/utils";
import { enabledModules } from "config/app-modules";

interface PoolsTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    action?: (args?: any) => void;
    defaultSortingID?: string;
    link?: string;
    showPagination?: boolean;
    searchID?: string;
    loading?: boolean;
}

const PoolsTable = <TData, TValue>({
    columns,
    data,
    action,
    link,
    defaultSortingID,
    showPagination = true,
    loading,
}: PoolsTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>(defaultSortingID ? [{ id: defaultSortingID, desc: true }] : []);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const navigate = useNavigate();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        globalFilterFn: (row: any, _, value: boolean | undefined) => row.original.isMyPool === value,
    });

    const isMyPools: boolean | undefined = table.getState().globalFilter;

    const searchID = "pair";

    const totalRows = table.getFilteredRowModel().rows.length;
    const startsFromRow = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
    const endsAtRow = Math.min(startsFromRow + table.getState().pagination.pageSize - 1, totalRows);

    if (loading) return <LoadingState />;

    return (
        <>
            {searchID && (
                <div className="flex max-sm:flex-col gap-3 w-full items-center p-4 pb-0">
                    <div className="flex items-center relative w-full sm:w-fit">
                        <Input
                            placeholder="Search pool"
                            value={(table.getColumn(searchID)?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn(searchID)?.setFilterValue(event.target.value)}
                            className="border border-border border-opacity-60 pl-12 h-12 max-w-80 md:w-64 lg:w-80 focus:border-opacity-100 rounded-lg"
                        />
                        <Search className="absolute left-4 text-border" size={20} />
                    </div>
                    <div className="grid grid-flow-col gap-3 md:flex w-full sm:w-fit">
                        {enabledModules.farming && (
                            <Button
                                onClick={() => {
                                    const column = table.getColumn("avgApr");
                                    if (column?.getFilterValue() === undefined) column?.setFilterValue(true);
                                    else column?.setFilterValue(undefined);
                                }}
                                size="md"
                                className="flex h-12 min-w-[130px] items-center gap-2 whitespace-nowrap rounded-lg p-4"
                                variant={table.getColumn("avgApr")?.getFilterValue() === true ? "iconHover" : "outline"}
                            >
                                <span>🟡</span>
                                <span>Farm Pools</span>
                            </Button>
                        )}
                        <Button
                            onClick={() => table.setGlobalFilter(isMyPools ? undefined : true)}
                            className="flex h-12 min-w-[130px] items-center gap-2 whitespace-nowrap rounded-lg p-4"
                            size="md"
                            variant={isMyPools ? "iconHover" : "outline"}
                        >
                            <User className="text-primary-200" size={16} />
                            <span>My Pools</span>
                        </Button>
                        <Button
                            size="md"
                            onClick={() => {
                                table.setGlobalFilter(undefined);
                                table.getColumn("avgApr")?.setFilterValue(undefined);
                            }}
                            className={cn(
                                "flex h-12 w-fit items-center gap-2 whitespace-nowrap rounded-lg border border-light border-transparent p-4 max-lg:hidden max-md:col-span-2",
                                isMyPools || table.getColumn("avgApr")?.getFilterValue() ? "" : "hidden"
                            )}
                            variant={"outline"}
                        >
                            <span>Reset</span>
                            <X size={18} />
                        </Button>
                    </div>
                </div>
            )}
            <Table>
                <TableHeader className="[&_tr]:border-b [&_tr]:border-opacity-30 border-t border-opacity-60">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="rounded-xl font-semibold [&_svg]:mt-auto">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="hover:bg-transparent text-[16px]">
                    {!table.getRowModel().rows.length ? (
                        <TableRow className="hover:bg-card h-full">
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row: any) => {
                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-card-border/40 bg-card-dark hover:bg-card-hover cursor-pointer"
                                    onClick={() => {
                                        if (action) {
                                            action(row.original.id);
                                        } else if (link) {
                                            navigate(`/${link}/${row.original.id}`);
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell: any) => (
                                        <TableCell key={cell.id} className="text-left min-w-[120px] first:min-w-[220px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            {showPagination && (
                <div className="flex items-center justify-end space-x-2 px-4 mt-auto">
                    {totalRows > 0 && (
                        <p className="mr-2">
                            {startsFromRow === totalRows
                                ? `${startsFromRow} of ${totalRows}`
                                : `${startsFromRow} - ${endsAtRow} of ${totalRows}`}
                        </p>
                    )}
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            )}
        </>
    );
};
export default PoolsTable;
