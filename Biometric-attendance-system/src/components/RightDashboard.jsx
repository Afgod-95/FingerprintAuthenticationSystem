import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Searchbar from '../components/SearchBar';
import StudentCard from './StudentCard';
import { useSelector } from 'react-redux';
import { buttonsBgColor } from '../constants/Colors';
import ViewStudentDetails from '../pages/ViewStudentDetails';

const tabIndicatorAnimation = {
  initial: { width: 0, x: 0 },
  animate: { width: 0, x: 0 },
  exit: { width: 0, x: 0 },
};

const RightDashboard = () => {

  const [value, setValue] = useState(0);
  const [indicatorStyles, setIndicatorStyles] = useState({ width: 0, x: 0 });
  const tabRefs = useRef([]);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const { students } = useSelector(state => state.admin);
  const LOGIN_CUTOFF_TIME = students.examTime;

  // Filtered student lists
  const loginStudents = students.filter(item => item.status === 'Present');
  const onTimeStudents = loginStudents.filter(student => student.timeStamps && student.timeStamps <= LOGIN_CUTOFF_TIME);
  const lateStudents = loginStudents.filter(student => student.timeStamps && student.timeStamps > LOGIN_CUTOFF_TIME);
  const [openModal, setOpenModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState('')
  
  const viewStudent = (studentId) => {
    setSelectedStudent(studentId)
    console.log(`Selected student: ${studentId}`)
  }
  
  useEffect(() => {
    if (tabRefs.current[value]) {
      const { offsetWidth, offsetLeft } = tabRefs.current[value];
      setIndicatorStyles({ width: offsetWidth, x: offsetLeft });
    }
  }, [value]);

  // date and time function
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    // Get the weekday and formatted date
    const optionsDate = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);

    // Get the time
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);

    return `${formattedDate} at ${formattedTime}`;
  };


  useEffect(() => {
    const applyFilters = () => {
      let data = [];

      switch (value) {
        case 0:
          data = students;
          break;
        case 1:
          data = loginStudents;
          break;
        case 2:
          data = onTimeStudents;
          break;
        case 3:
          data = lateStudents;
          break;
        default:
          data = [];
      }

      // Filter by department
      if (selectedDepartment) {
        data = data.filter(item => item.department === selectedDepartment);
      }

      // Filter by search
      return data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    };

    setFilteredData(applyFilters());
  }, [value, selectedDepartment, search, students, loginStudents, onTimeStudents, lateStudents]);

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleSelectChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleChange = (index) => {
    setValue(index);
  };

  const renderContent = () => {
    const itemsToRender = filteredData.slice(0, 7);

    if (itemsToRender.length === 0) {
      return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No student found</p>;
    }

    return (
      <div style={{ margin: '.5rem auto' }}>
        {itemsToRender
          .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
          .reverse().map((item, index) => (
            <div
              key={item.id || index}
              style={{
                padding: '.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '.5rem',
              }}
            >
              <StudentCard
                img={item.image}
                name={item.name}
                dept={item.department}
                status={item.status === 'Present' ? 'Present' : 'Absent'}
                logTime= {formatDate(item?.updatedAt)}
                onclick = {() => viewStudent(item._id)}
              />
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="tabs-container">
      <div style={{ margin: '20px auto', width: '90%' }}>
        <select
          id="department-select"
          value={selectedDepartment}
          onChange={handleSelectChange}
          style={{
            width: '100%',
            height: 40,
            backgroundColor: buttonsBgColor,
            color: '#acadac',
            border: 'none',
            outline: 'none',
            borderRadius: '10px',
            padding: '0 10px',
          }}
        >
          <option value="">Select a department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
        </select>
      </div>

      <Searchbar placeholder={"Search students"} search={search} setSearch={handleSearch} />

      <div className="tabs-header" style={{ borderBottom: 'thin solid rgba(255,255,255,0.3)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '90%',
            margin: '0px auto',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            className={`tab-item ${value === 0 ? 'active-tab' : ''}`}
            onClick={() => handleChange(0)}
            ref={(el) => (tabRefs.current[0] = el)}
          >
            <p>All students ({students.length})</p>
          </div>
          <div
            className={`tab-item ${value === 1 ? 'active-tab' : ''}`}
            onClick={() => handleChange(1)}
            ref={(el) => (tabRefs.current[1] = el)}
          >
            <p>Logged in ({loginStudents.length})</p>
          </div>
          <div
            className={`tab-item ${value === 2 ? 'active-tab' : ''}`}
            onClick={() => handleChange(2)}
            ref={(el) => (tabRefs.current[2] = el)}
          >
            <p>Ontime ({onTimeStudents.length})</p>
          </div>
          <div
            className={`tab-item ${value === 3 ? 'active-tab' : ''}`}
            onClick={() => handleChange(3)}
            ref={(el) => (tabRefs.current[3] = el)}
          >
            <p>Late ({lateStudents.length})</p>
          </div>

          <motion.div
            className="indicator"
            style={{
              width: indicatorStyles.width,
              transform: `translateX(${indicatorStyles.x}px)`,
            }}
            variants={tabIndicatorAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      <div className="tabs-content" style={{ overflowY: 'scroll', height: '80vh', paddingBottom: '10rem' }}>
        {renderContent()}

        {openModal && 
          <ViewStudentDetails 
            user = {selectedStudent}
            onClose = {() => setOpenModal(false)}
          />
        }
      </div>
    </div>
  );
};

export default RightDashboard;
