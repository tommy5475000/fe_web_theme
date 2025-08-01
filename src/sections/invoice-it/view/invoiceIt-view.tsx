import { useState } from "react";

import { Box, Button, Card, Table, TableContainer, Typography } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { ButtonGroup } from "src/components/button";
import { Scrollbar } from "src/components/scrollbar";

import { useTable } from "src/sections/user/view";
import { InvoiceTableHead } from "../invoice-table-head";


export function InvoiceItView() {
  const table = useTable()
  const [filterName, setFilterName] = useState("")
  const handleOpen = () => { }
  const handleImport = () => { }
  const handleExport = () => { }

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

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <InvoiceTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={}
            />


          </Table>
        </TableContainer>


      </Scrollbar>

    </DashboardContent >
  );



}