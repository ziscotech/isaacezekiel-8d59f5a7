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
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Organization</span>
                <Filter className="w-3 h-3" />
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Username</span>
                <Filter className="w-3 h-3" />
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Email</span>
                <Filter className="w-3 h-3" />
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Phone Number</span>
                <Filter className="w-3 h-3" />
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Date Joined</span>
                <Filter className="w-3 h-3" />
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Status</span>
                <Filter className="w-3 h-3" />
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-medium text-lendsqr-gray uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-lendsqr-light-gray/50">
              <td className="py-4 px-4 text-sm text-lendsqr-navy">{user.organization}</td>
              <td className="py-4 px-4 text-sm text-lendsqr-navy">{user.username}</td>
              <td className="py-4 px-4 text-sm text-lendsqr-navy">{user.email}</td>
              <td className="py-4 px-4 text-sm text-lendsqr-navy">{user.phoneNumber}</td>
              <td className="py-4 px-4 text-sm text-lendsqr-navy">{formatDate(user.dateJoined)}</td>
              <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
              <td className="py-4 px-4 relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                  className="p-1 hover:bg-lendsqr-light-gray rounded"
                >
                  <MoreVertical className="w-4 h-4 text-lendsqr-gray" />
                </button>
                
                {activeDropdown === user.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                    <button
                      onClick={() => {
                        onUserAction(user.id, 'view');
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-lendsqr-navy hover:bg-lendsqr-light-gray"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        onUserAction(user.id, 'blacklist');
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-lendsqr-navy hover:bg-lendsqr-light-gray"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Blacklist User
                    </button>
                    <button
                      onClick={() => {
                        onUserAction(user.id, 'activate');
                        setActiveDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-lendsqr-navy hover:bg-lendsqr-light-gray"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
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
      
      {/* Stats Cards - Same as Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats cards would go here - simplified for now */}
      </div>

      {/* Users Table */}
      <div className="lendsqr-card">
        <UsersTable users={users} onUserAction={handleUserAction} />
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-lendsqr-gray">
            Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-lendsqr-gray hover:text-lendsqr-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-lendsqr-gray hover:text-lendsqr-navy'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-lendsqr-gray hover:text-lendsqr-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;