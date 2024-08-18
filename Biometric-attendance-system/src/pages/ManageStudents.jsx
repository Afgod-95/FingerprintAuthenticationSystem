import { useMemo } from 'react';

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import { useMediaQuery } from 'react-responsive';

//Material UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

//Mock Data
import { data } from '../components/makeData.jsx'


const Example = () => {
  const columns = useMemo(
    () => [
      {
        id: 'employee', 
        header: 'Employee',
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: 'name',
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: '50%' }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'email',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            size: 300,
          },
        ],
      },
      {
        id: 'id',
        header: 'Job Info',
        columns: [
          {
            accessorKey: 'salary',
            filterFn: 'between',
            header: 'Salary',
            size: 200,
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() < 50_000
                      ? theme.palette.error.dark
                      : cell.getValue() >= 50_000 && cell.getValue() < 75_000
                        ? theme.palette.warning.dark
                        : theme.palette.success.dark,
                  borderRadius: '0.25rem',
                  color: '#fff',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {cell.getValue()?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ),
          },
          {
            accessorKey: 'jobTitle',
            header: 'Job Title',
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate),
            id: 'startDate',
            header: 'Start Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
            Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
            Header: ({ column }) => <em>{column.columnDef.header}</em>,
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '250px',
              },
            },
          },
        ],
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, 
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
      pagination: {
        pageSize: 5, 
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },
    
    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        View Profile
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Send Email
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.getValue('name'));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.getValue('name'));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.getValue('name'));
        });
      };
      const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
      
      
      return (
        <Box
          sx={{
            display: 'flex',
            gap: '0.5rem',
            p: '8px',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : ''
          }}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
               
                variant="contained"
              >
                Download Report
              </Button>
              <Button
                color="error"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleDeactivate}
                variant="contained"
              >
                Delete
              </Button>
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
                variant="contained"
              >
                Edit
              </Button>
              <Button
                color="info"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleContact}
                variant="contained"
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
  });

  return (
    <Box
      sx={{
        bgcolor: HomeBgColor, // Change this color to your desired background color
        borderTopLeftRadius:'30px',
        height: '100%'
      }}
    >

        <Box
            sx={{
                p: 4,
                overflow: 'auto',
                height: '100vh'  
            }}
        >
            <MaterialReactTable table={table}  />
        </Box>
    </Box>
  );
};

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { bgColor, HomeBgColor } from '../constants/Colors.jsx';

const ManageStudents = () => (
  <div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Example />
    </LocalizationProvider>
  </div>
  
);

export default ManageStudents;
