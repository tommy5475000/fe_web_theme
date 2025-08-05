import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query"

import { Box,  Card, Table, TableBody,  TableContainer, TablePagination, TableRow, Typography } from "@mui/material";

import { getInvoiceXlm } from "src/apis/it";
import { DashboardContent } from "src/layouts/dashboard";

import { ButtonGroup } from "src/components/button";
import { Scrollbar } from "src/components/scrollbar";

import { TableNoData } from "src/sections/user/table-no-data";
import { TableEmptyRows } from "src/sections/user/table-empty-rows";

import { InvoiceTableHead } from "../invoice-table-head";
import { InvoiceTableToolbar } from "../invoice-table-toolbar";
import { applyFilterIvn, emptyRows, getComparator, } from "../utils";
import { InvoiceProps, InvoiceTableRow } from "../invoice-table-row";

export function InvoiceItView() {
  const table = useTable()
  const [filterName, setFilterName] = useState("")
  const handleOpen = () => { }
  const handleImport = () => { }
  const handleExport = () => { }

  const { data: dataXml = [] } = useQuery<InvoiceProps[]>({
    queryKey: ["dataXml"],
    queryFn: getInvoiceXlm
  })

  const dataFiltered = applyFilterIvn({
    inputData: dataXml,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  })

  const notFound = !dataFiltered.length && !!filterName;


  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Invoices
        </Typography>
        <ButtonGroup
          handleOpen={handleOpen}
          handleImport={handleOpen}
          handleExport={handleOpen}
        />
      </Box >
      <Card>
        <InvoiceTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <InvoiceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numberSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((item) => item.soHd)
                  )
                }
                headLabel={[
                  { id: 'soHd', label: 'Số HĐ', minWidth: 80 },
                  { id: 'kyHieuHd', label: 'Ký Hiệu' },
                  { id: 'ngayHd', label: 'Ngày', minWidth: 120 },
                  { id: 'tenNcc', label: 'Tên NCC', minWidth: 150 },
                  { id: 'noiDung', label: 'Nội Dung' },
                  { id: 'tienThue', label: 'Vat' },
                  { id: 'tongTien', label: 'Tổng Tiền' },
                  { id: 'loaiHing', label: 'Loại Hình', minWidth: 120 },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <InvoiceTableRow
                      key={row.soHd}
                      row={row}
                      selected={table.selected.includes(row.soHd)}
                      onSelectRow={() => table.onSelectRow(row.soHd)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataXml.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataXml.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[10, 50, 100]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

    </DashboardContent >
  );

}
  
// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('tenNcc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
