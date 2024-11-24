import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';


// async thunk for admin login
export const loginAdmin = createAsyncThunk(
    'admin/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/login', credentials);
            const { token, refreshToken, admin, message } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            toast.success(message);
            return { token, refreshToken, admin }; 
        } catch (error) {
            toast.error(error.response?.data?.error || "Login failed");
            return rejectWithValue(error.response?.data);
        }
    }
);



// async thunk for admin profile update
export const updateAdminProfile = createAsyncThunk(
    'admin/updateProfile',
    async ({ adminID, image, name, email }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);
        formData.append('email', email);
        try {
            const response = await axios.patch(`/api/admin/update-profile/${adminID}`, formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error);
            return rejectWithValue(error.response?.data);
        }
    }
);

// async thunk for fecthing admin by id from the database
export const fetchAdminBy_ID = createAsyncThunk(
    'admin/fetchAdminBy_ID',
    async ({ adminID }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/admin/profile/${adminID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.admin;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                error.message || "Failed to fetch admin data"
            );
        }
    }
);

// async thunk for fecthing students from the database
export const fetchAllStudents =  createAsyncThunk(
    'admin/fetchAllStudents',
    async(_, { rejectWithValue }) => {
        try{
            const response = await axios.get('/api/admin/students', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            return response.data.students
        }
        catch (error){
            return rejectWithValue(error.response?.data);
        }
    }
)


export const delStudentBy_ID = createAsyncThunk(
    'admin/delStudentBy_ID',
    async ({ studentID }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/admin/student/${studentID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success(response.data.message);
            return { studentID, message: response.data.message };
        } catch (error) {
            toast.error(error.response?.data?.error);
            return rejectWithValue(error.response?.data);
        }
    }
);


// async thunk for update students 
export const updateStudentBy_ID = createAsyncThunk(
    'admin/updateStudentBy_ID',
    async({ studentID, studentData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`/api/admin/student/${studentID}`, studentData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toast.success(response.data.message)
            console.log(response.data.student)
            return response.data.student
        }
        catch(error){
            toast.error(error.response?.data?.error);
            return rejectWithValue(error.response?.data);
        }
    }
)


// function to delete all students from the database
export const delAllStudents = createAsyncThunk(
    'admin/delAllStudents',
    
    async ({ studentIds }, { rejectWithValue }) => {
        try {
          const response = await axios.delete('/api/admin/student/delete-all', {
            data: { ids: studentIds }
          });
          toast.success(response.data.message)
          return response.data.message || studentIds;
        } catch (error) {
        toast.error(error.response?.data?.error);
          return rejectWithValue(error.response.data);
        }
      }
);


// Thunk to refresh the access token
export const refreshAccessToken = createAsyncThunk(
    'admin/refreshAccessToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/refresh-token', {
                refreshToken: localStorage.getItem('refreshToken')
            });

            console.log(`Refresh token: ${response.data}`)
            const { newAccessToken, refreshToken, expiresIn } = response.data;

            localStorage.setItem('token', newAccessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('tokenExpiration', Date.now() + expiresIn * 1000) // expires in 7 days;
            
            return { newAccessToken, refreshToken };
        } catch (error) {
            console.log(`Refresh Token Error: ${error.message}`)
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//student login async thunk
export const studentLogin = createAsyncThunk(
    'student/login',
    async({ credentials }, { rejectWithValue }) => {
        try{
            const response = await axios.post('/api/student/login', credentials);
            const { token, refreshToken, student, message } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            toast.success(message);
            return { token, refreshToken, student }; 
        }

        catch (error) {
            toast.error(error.response?.data?.error);
            return rejectWithValue(error.response?.data);
        }
    } 
);


//controller of redux actions
const adminSlice = createSlice({
    name: "admin",
    initialState: {
        adminInfo: null,
        students: [],
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        error: null,
        loading: false
    },

    reducers: {

        updateTokens: (state, action) => {
            state.token = action.payload.newAccessToken; 
            state.refreshToken = action.payload.refreshToken;
        },
        
        checkAdminAuthentication: (state) => {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            if (token && refreshToken) {
                state.token = token;
                state.refreshToken = refreshToken;
                state.isAuthenticated = true;
            } else {
                state.isAuthenticated = false;
                state.loading = false;
            }
        },

        logout: (state) => {

            state.adminInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            toast.success("You have successfully logged out");
        },



        resetState: (state) => {
            state.adminInfo = null;
            state.studentInfo = null;
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
            state.error = null;
            state.loading = false;  
        }
    },



    extraReducers: (builder) => {
        builder
            // do something 
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload.admin;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload;
            })
            .addCase(updateAdminProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdminProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAdminBy_ID.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload;  
            })
            .addCase(fetchAdminBy_ID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminBy_ID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchAllStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(delStudentBy_ID.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.filter((student) => student._id !== action.payload.studentID);
            })
            
            .addCase(delStudentBy_ID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(delStudentBy_ID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(updateStudentBy_ID.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateStudentBy_ID.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.map(student =>
                    student._id === action.payload._id ? action.payload : student
                );
            })
            .addCase(updateStudentBy_ID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(delAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                if (typeof action.payload === 'string') {
                    state.students = [];
                } else {
                    const deletedStudentIds = action.payload;
                    state.students = state.students.filter(
                        (student) => !deletedStudentIds.includes(student.id)
                    );
                }
            })
            .addCase(delAllStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(delAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //refreshing token
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.newAccessToken; 
                state.refreshToken = action.payload.refreshToken;
            })
            
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //student login
            .addCase(studentLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.newAccessToken;
                state.refreshToken = action.payload.refreshToken;
                state.studentInfo = action.payload.student;
            })
            .addCase(studentLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(studentLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        )
    },
});

export const { logout, checkAdminAuthentication, resetState, updateTokens } = adminSlice.actions;
export default adminSlice.reducer;
