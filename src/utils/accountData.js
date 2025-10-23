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

// Customer Accounts Data
export const customerAccounts = [
  {
    id: 201,
    name: "Tran Minh Quan",
    phone: "0901234567",
    email: "tran.minh.quan@email.com",
    password: "customer123",
    role: "Customer",
    joinDate: "2024-03-15",
    status: "Active",
    vehicles: [
      {
        id: 1,
        make: "VinFast",
        model: "VF 8",
        year: 2023,
        vin: "VF8A123456789",
        licensePlate: "30A-12345",
        color: "Pearl White",
        mileage: 15000
      }
    ],
    totalBookings: 8,
    loyaltyPoints: 1200
  },
  {
    id: 202,
    name: "Le Thi Mai Anh",
    phone: "0902345678",
    email: "le.thi.mai.anh@email.com",
    password: "customer123",
    role: "Customer",
    joinDate: "2024-01-20",
    status: "Active",
    vehicles: [
      {
        id: 2,
        make: "VinFast",
        model: "VF 9",
        year: 2023,
        vin: "VF9B987654321",
        licensePlate: "51B-67890",
        color: "Midnight Black",
        mileage: 22000
      },
      {
        id: 3,
        make: "VinFast",
        model: "VF e34",
        year: 2022,
        vin: "VFE34C555666777",
        licensePlate: "43C-11111",
        color: "Sky Blue",
        mileage: 35000
      }
    ],
    totalBookings: 15,
    loyaltyPoints: 2100
  },
  {
    id: 203,
    name: "Nguyen Van Huy",
    phone: "0903456789",
    email: "nguyen.van.huy@email.com",
    password: "customer123",
    role: "Customer",
    joinDate: "2023-11-10",
    status: "Active",
    vehicles: [
      {
        id: 4,
        make: "VinFast",
        model: "VF 5",
        year: 2023,
        vin: "VF5D888999000",
        licensePlate: "59D-22222",
        color: "Red",
        mileage: 8000
      }
    ],
    totalBookings: 5,
    loyaltyPoints: 750
  },
  {
    id: 204,
    name: "Pham Thi Thu Trang",
    phone: "0904567890",
    email: "pham.thi.thu.trang@email.com",
    password: "customer123",
    role: "Customer",
    joinDate: "2024-02-28",
    status: "Active",
    vehicles: [
      {
        id: 5,
        make: "VinFast",
        model: "VF 8 Plus",
        year: 2024,
        vin: "VF8E111222333",
        licensePlate: "47E-33333",
        color: "Silver",
        mileage: 5000
      }
    ],
    totalBookings: 3,
    loyaltyPoints: 450
  },
  {
    id: 205,
    name: "Hoang Tuan Anh",
    phone: "0905678901",
    email: "hoang.tuan.anh@email.com",
    password: "customer123",
    role: "Customer",
    joinDate: "2023-09-05",
    status: "Active",
    vehicles: [
      {
        id: 6,
        make: "VinFast",
        model: "VF 9",
        year: 2023,
        vin: "VF9F444555666",
        licensePlate: "37F-44444",
        color: "Forest Green",
        mileage: 18000
      }
    ],
    totalBookings: 12,
    loyaltyPoints: 1800
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
  })),
  ...customerAccounts.map(customer => ({
    phone: customer.phone,
    password: customer.password,
    role: customer.role,
    name: customer.name,
    id: customer.id
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

export const getCustomerById = (id) => {
  return customerAccounts.find(customer => customer.id === id);
};

export const getCustomerByPhone = (phone) => {
  return customerAccounts.find(customer => customer.phone === phone);
};