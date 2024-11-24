import { useEffect, useMemo, useState } from 'react';
import axios from 'axios'; 
import { Buffer } from 'buffer'
import { toast } from 'react-hot-toast'

// MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import { useMediaQuery } from 'react-responsive';

// Material UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
} from '@mui/material';

// Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

// Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Constants
import { HomeBgColor } from '../constants/Colors.jsx'
import EditUserModal from '../components/EditUserModal.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { delAllStudents, delStudentBy_ID, fetchAllStudents } from '../redux/reducers.jsx';
import CircularLoader from '../components/Loaders.jsx';

const Example = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  
  //dispacth students 
  const dispatch = useDispatch()
  const { adminInfo, students, loading } = useSelector((state) => state.admin)

  //selected student
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [openEditModal, setOpenEditModal] = useState(false)

  useEffect (() => {
    dispatch(fetchAllStudents())
  }, [dispatch])

  console.log(students)
  const columns = useMemo(
    () => [
      {
        id: 'students',
        header: 'Students',
        columns: [
          {
            accessorFn: (row) => `${row.name}`,
            id: 'name',
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => {
              const { contentType, data } = row.original.image || {};
              const imageSrc = contentType && data
                ? `data:${contentType};base64,${Buffer.from(data.data).toString('base64')}`
                : null;
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {imageSrc ? (
                    <img
                      alt="avatar"
                      height={35}
                      width={35}
                      src={imageSrc}
                      loading="lazy"
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <AccountCircle style={{ fontSize: 35 }} /> 
                  )}
                  <span>{renderedCellValue}</span>
                </Box>
              );
            },
          },
          {
            accessorKey: 'email',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            size: 300,
          },
          {
            accessorKey: 'phoneNumber',
            header: 'Phone Number',
            size: 150,
          },
          {
            accessorKey: 'gender',
            header: 'Gender',
            size: 200,
          },
          {
            accessorKey: 'dateOfBirth',
            header: 'Date of Birth',
            size: 200,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
          },
          {
            accessorKey: 'department',
            header: 'Department',
            size: 200,
          },
          {
            accessorKey: 'faculty',
            header: 'Faculty',
            size: 200,
          },
          {
            accessorKey: 'program',
            header: 'Program',
            size: 200,
          },

          {
            accessorKey: 'seatNumber',
            header: 'Seat Number',
            size: 200,
          },
          {
            accessorKey: 'level',
            header: 'Level',
            size: 150,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            size: 150,
            Cell: ({ cell }) => {
              const status = cell.getValue();
              return (
                <Box
                  sx={{
                    bgcolor: status === 'Present' ? 'green' : 'red',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '4px',
                    padding: '0.5rem',
                  }}
                >
                  {status}
                </Box>
              );
            },
          },
          
          {
            accessorKey: 'yearOfEnrollment',
            header: 'Year of Enrollment',
            size: 200,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
          },
          {
            accessorKey: 'yearOfCompletion',
            header: 'Year of Completion',
            size: 200,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
          },
          {
            accessorKey: 'createdAt',
            header: 'Created At',
            size: 200,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: students,
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
          alert('View Profile clicked'); 
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
          alert('Send Email clicked'); 
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
        const handleDelete = async () => {
            try {
              const selectedRows = table.getSelectedRowModel().flatRows;
              const studentIds = selectedRows.map(row => row.original._id);
              console.log(studentIds)
          
              if (studentIds.length === 1) {
                dispatch(delStudentBy_ID({ studentID: studentIds[0] }))
                  .unwrap()
                  .then(() => {
                    dispatch(fetchAllStudents());
                  });
              }
              

              else if (studentIds.length > 0) {
                dispatch(delAllStudents({ 
                  studentIds: studentIds
                })).unwrap().then(() => {
                  dispatch(fetchAllStudents());
                })
              } 
              
              else {
                toast.error('No students selected for deletion.');
              }
            } catch (error) {
              console.error('Error deleting students:', error.message);
            }
          };
          
          
          //edit student modal
          const handleEdit = async () => {
            const selectedRows = table.getSelectedRowModel().flatRows;
            if( selectedRows.length === 1){
                const student = selectedRows[0].original
                setSelectedStudent(student)
                setOpenEditModal(true)
            }
            else {
                toast.error('Please select one student to edit')
            }
              
          };


        const handleContact = () => {
            table.getSelectedRowModel().flatRows.forEach((row) => {
            alert('Contacting ' + row.getValue('name'));
            // Implement actual contact logic here
            });
        };

        const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

      return (
        <Box
          sx={{
            display: 'flex',
            gap: '0.5rem',
            p: '8px',
            color: 'black',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : '',
          }}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                color="error"
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleDelete}
                variant="contained"
              >
                 Delete
              </Button>
              
              <Button
                color="success"
                disabled={table.getSelectedRowModel().flatRows.length !== 1}
                onClick={handleEdit}
                variant="contained"
              >

                Edit
              </Button>
              
              <Button
                color="info"
                disabled={table.getSelectedRowModel().flatRows.length === 0}
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
        bgcolor: HomeBgColor, 
        borderTopLeftRadius: '30px',
        height: '100%',
        width:  isMobile ? '90%' : '100%',
        margin: 'auto'
      }}
    >
     
      <Box
        sx={{
          p: 4,
          overflow: 'auto',
          height: '100vh',
          width: '100%',
          paddingBottom: '8rem'
        }}
      >
        <h2 style={{textAlign: 'left',color: '#fff', marginBottom: '15px'}}>Manage Students</h2>
       
        <MaterialReactTable table={table} />


        {openEditModal && 
            <EditUserModal onClose={() => setOpenEditModal(false)} 
                user = {selectedStudent}
                isOpen = {openEditModal}
            />
        }
      </Box>
    </Box>
  );
};

const ManageStudents = () => (
  <div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Example />
    </LocalizationProvider>
  </div>
);

export default ManageStudents;
