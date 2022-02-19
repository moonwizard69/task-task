import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import NewRequestDialogBox from "./WorkRequestDialog";
import styled from "@emotion/styled";
import { useState } from "react";
import Link from "next/link";

interface Data {
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

function createData(
  employeeId: string,
  employeeName: string,
  position: string,
  department: string,
  email: string,
  phone: string
): Data {
  return {
    employeeId,
    employeeName,
    position,
    department,
    email,
    phone,
  };
}

const StyledButton = styled(Button)`
  margin-left: 25px;
`;
const rows = [
  createData(
    "101",
    "Jeff Klein",
    "Maintenance Manager",
    "Maintenance",
    "jklein@gmail.com",
    "(231)796-5443"
  ),
  createData(
    "104",
    "Mike Cousineau",
    "Custodian II",
    "Custodial",
    "mikecousineau01@gmail.com",
    "(743)541-9348"
  ),
  createData(
    "106",
    "Sally Jones",
    "Custodian I",
    "Custodial",
    "sjones@gmail.com",
    "(521)551-9348"
  ),
  createData(
    "108",
    "Allen Smith",
    "Grounds I",
    "Grounds Maintenance",
    "asmith@gmail.com",
    "(616)251-9341"
  ),
  createData(
    "114",
    "Sean Christianson",
    "Custodian I",
    "Custodial",
    "schristianson@gmail.com",
    "(215)551-6214"
  ),
  createData(
    "117",
    "Alice Moore",
    "Grounds Manager",
    "Grounds Maintenance",
    "amoore@gmail.com",
    "(731)688-1111"
  ),
  createData(
    "194",
    "Matt Cousineau",
    "Custodian I",
    "Custodial",
    "mcousineau@gmail.com",
    "(645)873-9114"
  ),
  createData(
    "204",
    "John Doe",
    "Custodian Manager",
    "Custodial",
    "jdoe@gmail.com",
    "(215)541-9348"
  ),
  createData(
    "217",
    "Jane Doe",
    "Student Worker",
    "Custodial",
    "janedoe@gmail.com",
    "(843)141-9911"
  ),
  createData(
    "288",
    "Chris Moore",
    "Student Worker",
    "Custodial",
    "cmoore@gmail.com",
    "(841)241-6214"
  ),
  createData(
    "299",
    "Alex White",
    "Maintenance II",
    "Maintenance",
    "alexw@gmail.com",
    "(145)541-6321"
  ),
  createData(
    "314",
    "Mike Pemberton",
    "Electrical Maintenance",
    "Maintenance",
    "test@tester.edu",
    "(616)543-6663"
  ),
  createData(
    "467",
    "Doyle O'Poyle",
    "Custodian Apprentice",
    "Custodial",
    "dopoyle@gmail.com",
    "(231)555-9318"
  ),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "employeeId",
    numeric: false,
    disablePadding: true,
    label: "Employee #",
  },
  {
    id: "employeeName",
    numeric: true,
    disablePadding: false,
    label: "Employee Name",
  },
  {
    id: "position",
    numeric: true,
    disablePadding: false,
    label: "Position",
  },
  {
    id: "department",
    numeric: true,
    disablePadding: false,
    label: "Department",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Phone #",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Employee Directory
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("employeeId");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.employeeId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /*   const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }; */

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const [dialogVisible, setDialogVisible] = useState(false);

  const displayDialog = () => setDialogVisible(true);
  const cancelDialog = () => setDialogVisible(false);

  return (
    <Box sx={{ width: "100%" }}>
      <NewRequestDialogBox open={dialogVisible} onCancel={cancelDialog} />

      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.employeeId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      //onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.employeeId}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.employeeId}
                      </TableCell>
                      <TableCell align="right">{row.employeeName}</TableCell>
                      <TableCell align="right">{row.position}</TableCell>
                      <TableCell align="right">{row.department}</TableCell>
                      <TableCell align="right">
                        <Link href={"mailto:" + row.email}>{row.email}</Link>
                      </TableCell>
                      <TableCell align="right">
                        <Link href={"tel:" + row.phone}>{row.phone}</Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Printer View"
      />
    </Box>
  );
}