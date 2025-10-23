// Staff Accounts Data
export const staffAccounts = [
  {
    id: 1,
    name: "John Smith",
    phone: "0912345678",
    email: "john.smith@evservice.com",
    password: "staff123",
    role: "Staff",
    department: "Service Management",
    level: "Senior Staff",
    joinDate: "2023-01-15",
    status: "Active",
    permissions: ["view_bookings", "assign_technician", "create_accounts", "manage_schedule"]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "0923456789",
    email: "sarah.johnson@evservice.com",
    password: "staff123",
    role: "Staff",
    department: "Customer Service",
    level: "Staff",
    joinDate: "2023-03-20",
    status: "Active",
    permissions: ["view_bookings", "assign_technician", "customer_support"]
  },
  {
    id: 3,
    name: "Mike Wilson",
    phone: "0934567890",
    email: "mike.wilson@evservice.com",
    password: "staff123",
    role: "Staff",
    department: "Service Management",
    level: "Staff",
    joinDate: "2023-06-10",
    status: "Active",
    permissions: ["view_bookings", "assign_technician", "manage_schedule"]
  },
  {
    id: 4,
    name: "Emily Davis",
    phone: "0945678901",
    email: "emily.davis@evservice.com",
    password: "staff123",
    role: "Staff",
    department: "Admin",
    level: "Manager",
    joinDate: "2022-11-05",
    status: "Active",
    permissions: ["view_bookings", "assign_technician", "create_accounts", "manage_schedule", "admin_access", "reports"]
  }
];

// Technician Accounts Data
export const technicianAccounts = [
  {
    id: 101,
    name: "Robert Chen",
    phone: "0987654321",
    email: "robert.chen@evservice.com",
    password: "tech123",
    role: "Technician",
    level: "Level 4/4 (Expert)",
    specialization: "Battery Systems",
    experience: "8 years",
    rating: 4.9,
    reviews: 156,
    joinDate: "2022-02-10",
    status: "Active",
    certifications: ["EV Battery Specialist", "High Voltage Systems", "Diagnostic Expert"],
    currentAppointments: 3,
    completedJobs: 487
  },
  {
    id: 102,
    name: "Lisa Anderson",
    phone: "0976543210",
    email: "lisa.anderson@evservice.com",
    password: "tech123",
    role: "Technician",
    level: "Level 3/4 (Senior Technician)",
    specialization: "Motor & Drivetrain",
    experience: "5 years",
    rating: 4.7,
    reviews: 98,
    joinDate: "2023-01-20",
    status: "Active",
    certifications: ["EV Motor Systems", "Drivetrain Specialist", "Safety Certified"],
    currentAppointments: 2,
    completedJobs: 312
  },
  {
    id: 103,
    name: "David Martinez",
    phone: "0965432109",
    email: "david.martinez@evservice.com",
    password: "tech123",
    role: "Technician",
    level: "Level 3/4 (Senior Technician)",
    specialization: "General Maintenance",
    experience: "6 years",
    rating: 4.6,
    reviews: 124,
    joinDate: "2022-08-15",
    status: "Active",
    certifications: ["EV General Maintenance", "Brake Systems", "Tire Specialist"],
    currentAppointments: 4,
    completedJobs: 398
  },
  {
    id: 104,
    name: "Jennifer Taylor",
    phone: "0954321098",
    email: "jennifer.taylor@evservice.com",
    password: "tech123",
    role: "Technician",
    level: "Level 2/4 (Technician)",
    specialization: "Charging Systems",
    experience: "3 years",
    rating: 4.4,
    reviews: 67,
    joinDate: "2023-09-01",
    status: "Active",
    certifications: ["Charging Systems", "Basic EV Maintenance", "Safety Certified"],
    currentAppointments: 2,
    completedJobs: 156
  },
  {
    id: 105,
    name: "Thomas Brown",
    phone: "0943210987",
    email: "thomas.brown@evservice.com",
    password: "tech123",
    role: "Technician",
    level: "Level 2/4 (Technician)",
    specialization: "Diagnostic & Software",
    experience: "4 years",
    rating: 4.5,
    reviews: 89,
    joinDate: "2023-05-15",
    status: "Active",
    certifications: ["EV Diagnostics", "Software Updates", "CAN Bus Systems"],
    currentAppointments: 3,
    completedJobs: 234
  },
  {
    id: 106,
    name: "Amanda White",
    phone: "0932109876",
    email: "amanda.white@evservice.com",
    password: "tech123",
    role: "Technician",
    level: "Level 1/4 (Apprentice)",
    specialization: "General Maintenance",
    experience: "1 year",
    rating: 4.2,
    reviews: 34,
    joinDate: "2024-01-10",
    status: "Active",
    certifications: ["Basic EV Maintenance", "Safety Certified"],
    currentAppointments: 1,
    completedJobs: 67
  }
];

// Combined accounts for login validation
export const allAccounts = [
  ...staffAccounts.map(staff => ({
    phone: staff.phone,
    password: staff.password,
    role: staff.role,
    name: staff.name,
    id: staff.id
  })),
  ...technicianAccounts.map(tech => ({
    phone: tech.phone,
    password: tech.password,
    role: tech.role,
    name: tech.name,
    id: tech.id
  }))
];

// Helper functions
export const getAccountByPhone = (phone) => {
  return allAccounts.find(account => account.phone === phone);
};

export const getStaffById = (id) => {
  return staffAccounts.find(staff => staff.id === id);
};

export const getTechnicianById = (id) => {
  return technicianAccounts.find(tech => tech.id === id);
};

export const getAvailableTechnicians = () => {
  return technicianAccounts.filter(tech => tech.status === 'Active' && tech.currentAppointments < 5);
};

export const getStaffByDepartment = (department) => {
  return staffAccounts.filter(staff => staff.department === department);
};