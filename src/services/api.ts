import axios from 'axios';

// Types for our mock API data
export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  username: string;
  organization: string;
  dateJoined: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
  tier: number;
  accountBalance: number;
  bankName: string;
  accountNumber: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncome: [number, number];
  loanRepayment: number;
  guarantor: {
    fullName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

class ApiService {
  private baseURL = 'https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1';
  
  // Generate mock users data
  private generateMockUsers(): User[] {
    const users: User[] = [];
    const statuses: User['status'][] = ['Active', 'Inactive', 'Pending', 'Blacklisted'];
    const organizations = ['Lendsqr', 'Irorun', 'Lendstar'];
    const genders = ['Male', 'Female'];
    const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
    const educationLevels = ['B.Sc', 'M.Sc', 'Ph.D', 'HND', 'OND'];
    const employmentStatuses = ['Employed', 'Unemployed', 'Self-employed'];
    const sectors = ['FinTech', 'Agriculture', 'Real Estate', 'Education', 'Health'];

    for (let i = 1; i <= 500; i++) {
      const user: User = {
        id: `user-${i.toString().padStart(3, '0')}`,
        email: `user${i}@example.com`,
        phoneNumber: `080${(Math.floor(Math.random() * 100000000)).toString().padStart(8, '0')}`,
        fullName: `User ${i} Name`,
        username: `user${i}`,
        organization: organizations[Math.floor(Math.random() * organizations.length)],
        dateJoined: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        tier: Math.floor(Math.random() * 3) + 1,
        accountBalance: Math.floor(Math.random() * 1000000),
        bankName: 'Providus Bank',
        accountNumber: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
        bvn: (Math.floor(Math.random() * 90000000000) + 10000000000).toString(),
        gender: genders[Math.floor(Math.random() * genders.length)],
        maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
        children: Math.floor(Math.random() * 5).toString(),
        typeOfResidence: "Parent's Apartment",
        levelOfEducation: educationLevels[Math.floor(Math.random() * educationLevels.length)],
        employmentStatus: employmentStatuses[Math.floor(Math.random() * employmentStatuses.length)],
        sectorOfEmployment: sectors[Math.floor(Math.random() * sectors.length)],
        durationOfEmployment: `${Math.floor(Math.random() * 10) + 1} years`,
        officeEmail: `user${i}@lendsqr.com`,
        monthlyIncome: [Math.floor(Math.random() * 200000) + 50000, Math.floor(Math.random() * 400000) + 200000],
        loanRepayment: Math.floor(Math.random() * 50000) + 10000,
        guarantor: {
          fullName: `Guarantor ${i}`,
          phoneNumber: `081${(Math.floor(Math.random() * 100000000)).toString().padStart(8, '0')}`,
          email: `guarantor${i}@example.com`,
          relationship: 'Friend'
        }
      };
      users.push(user);
    }
    return users;
  }

  // Store users in localStorage if not already there
  private ensureMockData() {
    if (!localStorage.getItem('lendsqr-users')) {
      const users = this.generateMockUsers();
      localStorage.setItem('lendsqr-users', JSON.stringify(users));
    }
  }

  async login(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    // Mock login - accept any email/password for demo
    if (credentials.email && credentials.password) {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('lendsqr-token', token);
      return {
        token,
        user: {
          email: credentials.email,
          name: 'Admin User'
        }
      };
    }
    throw new Error('Invalid credentials');
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    this.ensureMockData();
    const users: User[] = JSON.parse(localStorage.getItem('lendsqr-users') || '[]');
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      users: users.slice(startIndex, endIndex),
      total: users.length
    };
  }

  async getUser(id: string): Promise<User> {
    this.ensureMockData();
    const users: User[] = JSON.parse(localStorage.getItem('lendsqr-users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Store in localStorage for offline access
    localStorage.setItem(`lendsqr-user-${id}`, JSON.stringify(user));
    
    return user;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    this.ensureMockData();
    const users: User[] = JSON.parse(localStorage.getItem('lendsqr-users') || '[]');
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'Active').length,
      usersWithLoans: Math.floor(users.length * 0.25), // 25% have loans
      usersWithSavings: Math.floor(users.length * 0.6) // 60% have savings
    };
  }

  async updateUserStatus(id: string, status: User['status']): Promise<void> {
    this.ensureMockData();
    const users: User[] = JSON.parse(localStorage.getItem('lendsqr-users') || '[]');
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex !== -1) {
      users[userIndex].status = status;
      localStorage.setItem('lendsqr-users', JSON.stringify(users));
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('lendsqr-token');
  }

  logout(): void {
    localStorage.removeItem('lendsqr-token');
  }
}

export const apiService = new ApiService();