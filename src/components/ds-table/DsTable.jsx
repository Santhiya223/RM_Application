import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import { useState } from "react";
  import { Spinner, Table } from "react-bootstrap";
  import DsPagination from "./DsPagination";
  
  const DsTable = ({
    options,
    columns,
    data,
    pageSize = 5,
    showPagination,
    rowsPerPageList,
    tableClass,
    theadClass,
    onRowClick,
    onPageChange,
    onPageSizeChange,
    totalRecords,
    currentPage,
    isLoading,
    emptyMessage = "No data found.",
  }) => {
    const [sorting, setSorting] = useState([]); // State to handle sorting
  
    const table = useReactTable({
      ...options,
      data,
      columns,
      state: {
        sorting, // Add sorting to table state
        pagination: {
          pageIndex: 0,
          pageSize
        }
      },
      onSortingChange: setSorting, // Function to update sorting state
      getCoreRowModel: getCoreRowModel(),
      ...(showPagination && {
        getPaginationRowModel: getPaginationRowModel(),
      }),
      getSortedRowModel: getSortedRowModel(), // Enable sorting model
    });
  
    const getPageCount = () => {
      return Math.ceil(totalRecords / pageSize);
    };
  
    return (
      <>
        <div style={{ overflowX: "auto" }}>
          {/* Enable horizontal scroll */}
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center my-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table hover className={`${tableClass} border-bottom`}>
              <thead className={theadClass}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()} // Add click handler to toggle sorting
                        style={{ cursor: "pointer", whiteSpace: "nowrap" }} // Prevent header text from wrapping
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
  
                            {{
                              asc: " 🔼", // Sort indicator for ascending
                              desc: " 🔽", // Sort indicator for descending
                            }[header.column.getIsSorted()] ?? null}
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      style={{ cursor: "pointer" }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={{ whiteSpace: "nowrap" }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="fs-4 p-3">
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
  
        {showPagination && !!getPageCount() && (
          <div className="mt-3">
          <DsPagination
            currentPage={currentPage}
            totalPages={getPageCount()}
            rowsPerPageList={rowsPerPageList}
            onPageChange={onPageChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
          </div>
        )}
      </>
    );
  };
  
  export default DsTable;
  