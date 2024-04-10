export const departments = [
    "Dept. of Mechanical Engineering",
    "Dept. of Electrical/Electronic Engineering",
    "Dept. of Civil Engineering",
    "Dept. of Interior Design and Upholstery Technology",
    "Dept. of Building Technology",
    "Dept. of Applied Mathematics and Statistics",
    "Dept. of Science Laboratory Technology",
    "Dept. of Computer Science",
    "Dept. of Medical Laboratory Technology",
    "Dept. of Hotel Catering & Institutional Management (HCIM)",
    "Dept. of Fashion Design & Textile Department",
    "Dept. of Liberal Studies and Communications Technology ",
    "Dept. of Accountancy and Finance",
    "Dept. of Management and Public Administration",
    "Dept. of Procurement and Supply Chain Management",
    "Dept. of Marketing",
];

export const faculties = [
    "Faculty of Applied Science",
    "Faculty of Engineering",
    "Faculty of Built Environment",
    "Faculty of Business",
    "Faculty of Applied Arts"
]

export const genders = [
    "Male", "Female"
]

export const levels = [
    "L100",
    "L200",
    "L300",
    "L400"
]

// Function to get dates from 2012 to current date
export const getDate = () => {
    const startDate = new Date(2012, 0, 1); 
    const endDate = new Date(); // Current date
  
    const datesArray = [];
    let currentDate = startDate;
  
    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(datesArray)
  
    return datesArray;
}
  