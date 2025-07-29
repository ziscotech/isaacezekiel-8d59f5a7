import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MoreVertical, 
  Eye, 
  UserX, 
  UserCheck, 
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiService, User } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface UsersTableProps {
  users: User[];
  onUserAction: (userId: string, action: 'view' | 'blacklist' | 'activate') => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onUserAction }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<string | null>(null);

  const getStatusBadge = (status: User['status']) => {
    const statusStyles = {
      Active: 'bg-status-active/10 text-status-active',
      Inactive: 'bg-status-inactive/10 text-status-inactive',
      Pending: 'bg-status-pending/10 text-status-pending',
      Blacklisted: 'bg-status-blacklisted/10 text-status-blacklisted'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Organization</span>
                <button 
                  onClick={() => setShowFilters(showFilters === 'organization' ? null : 'organization')}
                  className="relative"
                >
                  <Filter className="w-3 h-3" />
                  {showFilters === 'organization' && (
                    <div className="absolute top-6 left-0 bg-white border border-border rounded-lg shadow-lg p-4 z-20 w-56">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-lendsqr-navy mb-1">Organization</label>
                          <select className="w-full p-2 border border-border rounded text-sm">
                            <option>Select</option>
                            <option>Lendsqr</option>
                            <option>Irorun</option>
                            <option>Lendstar</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-border text-lendsqr-navy rounded text-sm">
                            Reset
                          </button>
                          <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </th>
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Username</span>
                <button 
                  onClick={() => setShowFilters(showFilters === 'username' ? null : 'username')}
                  className="relative"
                >
                  <Filter className="w-3 h-3" />
                  {showFilters === 'username' && (
                    <div className="absolute top-6 left-0 bg-white border border-border rounded-lg shadow-lg p-4 z-20 w-56">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-lendsqr-navy mb-1">Username</label>
                          <input 
                            type="text" 
                            placeholder="User"
                            className="w-full p-2 border border-border rounded text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-border text-lendsqr-navy rounded text-sm">
                            Reset
                          </button>
                          <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </th>
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Email</span>
                <button 
                  onClick={() => setShowFilters(showFilters === 'email' ? null : 'email')}
                  className="relative"
                >
                  <Filter className="w-3 h-3" />
                  {showFilters === 'email' && (
                    <div className="absolute top-6 left-0 bg-white border border-border rounded-lg shadow-lg p-4 z-20 w-56">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-lendsqr-navy mb-1">Email</label>
                          <input 
                            type="email" 
                            placeholder="Email"
                            className="w-full p-2 border border-border rounded text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-border text-lendsqr-navy rounded text-sm">
                            Reset
                          </button>
                          <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </th>
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Phone Number</span>
                <button 
                  onClick={() => setShowFilters(showFilters === 'phone' ? null : 'phone')}
                  className="relative"
                >
                  <Filter className="w-3 h-3" />
                  {showFilters === 'phone' && (
                    <div className="absolute top-6 left-0 bg-white border border-border rounded-lg shadow-lg p-4 z-20 w-56">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-lendsqr-navy mb-1">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="Phone Number"
                            className="w-full p-2 border border-border rounded text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-border text-lendsqr-navy rounded text-sm">
                            Reset
                          </button>
                          <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </th>
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Date Joined</span>
                <button 
                  onClick={() => setShowFilters(showFilters === 'date' ? null : 'date')}
                  className="relative"
                >
                  <Filter className="w-3 h-3" />
                  {showFilters === 'date' && (
                    <div className="absolute top-6 left-0 bg-white border border-border rounded-lg shadow-lg p-4 z-20 w-56">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-lendsqr-navy mb-1">Date</label>
                          <input 
                            type="date" 
                            className="w-full p-2 border border-border rounded text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-border text-lendsqr-navy rounded text-sm">
                            Reset
                          </button>
                          <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </th>
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Status</span>
                <button 
                  onClick={() => setShowFilters(showFilters === 'status' ? null : 'status')}
                  className="relative"
                >
                  <Filter className="w-3 h-3" />
                  {showFilters === 'status' && (
                    <div className="absolute top-6 left-0 bg-white border border-border rounded-lg shadow-lg p-4 z-20 w-56">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-lendsqr-navy mb-1">Status</label>
                          <select className="w-full p-2 border border-border rounded text-sm">
                            <option>Select</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Pending</option>
                            <option>Blacklisted</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-border text-lendsqr-navy rounded text-sm">
                            Reset
                          </button>
                          <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </th>
            <th className="text-left py-4 px-6 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-lendsqr-light-gray/30 transition-colors">
              <td className="py-4 px-6 text-sm text-lendsqr-navy">{user.organization}</td>
              <td className="py-4 px-6 text-sm text-lendsqr-navy">{user.username}</td>
              <td className="py-4 px-6 text-sm text-lendsqr-navy">{user.email}</td>
              <td className="py-4 px-6 text-sm text-lendsqr-navy">{user.phoneNumber}</td>
              <td className="py-4 px-6 text-sm text-lendsqr-navy">{formatDate(user.dateJoined)}</td>
              <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
              <td className="py-4 px-6 relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                  className="p-2 hover:bg-lendsqr-light-gray rounded transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-lendsqr-gray" />
                </button>
                
                {activeDropdown === user.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-md shadow-lg z-10 min-w-[160px]">
                    <button
                      onClick={() => {
                        onUserAction(user.id, 'view');
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-lendsqr-navy hover:bg-lendsqr-light-gray transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-3" />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        onUserAction(user.id, 'blacklist');
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-lendsqr-navy hover:bg-lendsqr-light-gray transition-colors"
                    >
                      <UserX className="w-4 h-4 mr-3" />
                      Blacklist User
                    </button>
                    <button
                      onClick={() => {
                        onUserAction(user.id, 'activate');
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-lendsqr-navy hover:bg-lendsqr-light-gray transition-colors"
                    >
                      <UserCheck className="w-4 h-4 mr-3" />
                      Activate User
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await apiService.getUsers(currentPage, usersPerPage);
      setUsers(result.users);
      setTotalUsers(result.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'view' | 'blacklist' | 'activate') => {
    switch (action) {
      case 'view':
        navigate(`/users/${userId}`);
        break;
      case 'blacklist':
        try {
          await apiService.updateUserStatus(userId, 'Blacklisted');
          toast({
            title: "User blacklisted",
            description: "User has been successfully blacklisted",
          });
          fetchUsers();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to blacklist user",
            variant: "destructive",
          });
        }
        break;
      case 'activate':
        try {
          await apiService.updateUserStatus(userId, 'Active');
          toast({
            title: "User activated",
            description: "User has been successfully activated",
          });
          fetchUsers();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to activate user",
            variant: "destructive",
          });
        }
        break;
    }
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-white rounded-lg p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-lendsqr-navy mb-6">Users</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="lendsqr-card p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-lendsqr-gray uppercase tracking-wide">Users</span>
          </div>
          <div className="text-2xl font-bold text-lendsqr-navy">2,453</div>
        </div>

        <div className="lendsqr-card p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-status-active/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-status-active" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-lendsqr-gray uppercase tracking-wide">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-lendsqr-navy">2,453</div>
        </div>

        <div className="lendsqr-card p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-lendsqr-gray uppercase tracking-wide">Users with Loans</span>
          </div>
          <div className="text-2xl font-bold text-lendsqr-navy">12,453</div>
        </div>

        <div className="lendsqr-card p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-lendsqr-gray uppercase tracking-wide">Users with Savings</span>
          </div>
          <div className="text-2xl font-bold text-lendsqr-navy">102,453</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="lendsqr-card">
        <UsersTable users={users} onUserAction={handleUserAction} />
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-6 border-t border-border">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-lendsqr-navy">Showing</span>
            <select className="px-3 py-1 border border-border rounded text-sm bg-white">
              <option>100</option>
              <option>50</option>
              <option>25</option>
              <option>10</option>
            </select>
            <span className="text-sm text-lendsqr-navy">out of 100</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-lendsqr-gray hover:text-lendsqr-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-lendsqr-gray hover:text-lendsqr-navy hover:bg-lendsqr-light-gray'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <span className="px-2 text-lendsqr-gray">...</span>
              
              {[15, 16].map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium text-lendsqr-gray hover:text-lendsqr-navy hover:bg-lendsqr-light-gray"
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-lendsqr-gray hover:text-lendsqr-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;