import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, User } from 'lucide-react';
import { apiService, User as UserType } from '../services/api';
import { useToast } from '../hooks/use-toast';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General Details');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    setLoading(true);
    try {
      const userData = await apiService.getUser(userId);
      setUser(userData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      });
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: UserType['status']) => {
    if (!user) return;
    
    try {
      await apiService.updateUserStatus(user.id, newStatus);
      setUser({ ...user, status: newStatus });
      toast({
        title: "Status updated",
        description: `User status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: UserType['status']) => {
    const statusStyles = {
      Active: 'bg-status-active/10 text-status-active',
      Inactive: 'bg-status-inactive/10 text-status-inactive',
      Pending: 'bg-status-pending/10 text-status-pending',
      Blacklisted: 'bg-status-blacklisted/10 text-status-blacklisted'
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const tabs = [
    'General Details',
    'Documents',
    'Bank Details',
    'Loans',
    'Savings',
    'App and System'
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded mr-4"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="lendsqr-card p-6 mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-lendsqr-navy mb-2">User not found</h2>
          <p className="text-lendsqr-gray mb-4">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/users')}
            className="lendsqr-btn-primary"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-4 md:mb-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center text-lendsqr-gray hover:text-lendsqr-navy mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Users
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-lendsqr-navy">User Details</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => handleStatusChange('Blacklisted')}
            className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors text-sm md:text-base"
          >
            BLACKLIST USER
          </button>
          <button
            onClick={() => handleStatusChange('Active')}
            className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm md:text-base"
          >
            ACTIVATE USER
          </button>
        </div>
      </div>

      {/* User Overview Card */}
      <div className="lendsqr-card p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 w-full lg:w-auto">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl md:text-2xl font-bold">
                {user.fullName.charAt(0)}
              </span>
            </div>
            
            {/* User Info */}
            <div className="md:border-r border-border md:pr-6 text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold text-lendsqr-navy mb-1">{user.fullName}</h2>
              <p className="text-lendsqr-gray">{user.username}</p>
            </div>
            
            {/* User Tier */}
            <div className="md:border-r border-border md:pr-6 text-center md:text-left">
              <p className="text-sm text-lendsqr-gray mb-2">User's Tier</p>
              <div className="flex items-center justify-center md:justify-start">
                {[...Array(3)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < user.tier ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            
            {/* Account Balance */}
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-bold text-lendsqr-navy mb-1">
                ₦{user.accountBalance.toLocaleString()}
              </p>
              <p className="text-sm text-lendsqr-gray">{user.accountNumber}/{user.bankName}</p>
            </div>
          </div>
          
          {/* Status */}
          <div className="text-center lg:text-right">
            {getStatusBadge(user.status)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lendsqr-card">
        <div className="border-b border-border overflow-x-auto">
          <nav className="flex space-x-4 md:space-x-8 px-4 md:px-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-lendsqr-gray hover:text-lendsqr-navy'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {activeTab === 'General Details' && (
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-lendsqr-navy mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-sm text-lendsqr-navy">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-sm text-lendsqr-navy">{user.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-sm text-lendsqr-navy">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">BVN</p>
                    <p className="text-sm text-lendsqr-navy">{user.bvn}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Gender</p>
                    <p className="text-sm text-lendsqr-navy">{user.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Marital Status</p>
                    <p className="text-sm text-lendsqr-navy">{user.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Children</p>
                    <p className="text-sm text-lendsqr-navy">{user.children}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Type of Residence</p>
                    <p className="text-sm text-lendsqr-navy">{user.typeOfResidence}</p>
                  </div>
                </div>
              </div>

              {/* Education and Employment */}
              <div>
                <h3 className="text-lg font-bold text-lendsqr-navy mb-4">Education and Employment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Level of Education</p>
                    <p className="text-sm text-lendsqr-navy">{user.levelOfEducation}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Employment Status</p>
                    <p className="text-sm text-lendsqr-navy">{user.employmentStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Sector of Employment</p>
                    <p className="text-sm text-lendsqr-navy">{user.sectorOfEmployment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Duration of Employment</p>
                    <p className="text-sm text-lendsqr-navy">{user.durationOfEmployment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Office Email</p>
                    <p className="text-sm text-lendsqr-navy">{user.officeEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Monthly Income</p>
                    <p className="text-sm text-lendsqr-navy">
                      ₦{user.monthlyIncome[0].toLocaleString()} - ₦{user.monthlyIncome[1].toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Loan Repayment</p>
                    <p className="text-sm text-lendsqr-navy">₦{user.loanRepayment.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-lg font-bold text-lendsqr-navy mb-4">Socials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Twitter</p>
                    <p className="text-sm text-lendsqr-navy">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Facebook</p>
                    <p className="text-sm text-lendsqr-navy">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Instagram</p>
                    <p className="text-sm text-lendsqr-navy">@{user.username}</p>
                  </div>
                </div>
              </div>

              {/* Guarantor */}
              <div>
                <h3 className="text-lg font-bold text-lendsqr-navy mb-4">Guarantor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-sm text-lendsqr-navy">{user.guarantor.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-sm text-lendsqr-navy">{user.guarantor.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-sm text-lendsqr-navy">{user.guarantor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Relationship</p>
                    <p className="text-sm text-lendsqr-navy">{user.guarantor.relationship}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="text-center py-12">
              <p className="text-lendsqr-gray">No documents available for this user.</p>
            </div>
          )}

          {activeTab === 'Bank Details' && (
            <div>
              <h3 className="text-lg font-bold text-lendsqr-navy mb-4">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Bank Name</p>
                  <p className="text-sm text-lendsqr-navy">{user.bankName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Account Number</p>
                  <p className="text-sm text-lendsqr-navy">{user.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-lendsqr-gray uppercase tracking-wider mb-1">Account Balance</p>
                  <p className="text-sm text-lendsqr-navy">₦{user.accountBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'Loans' || activeTab === 'Savings' || activeTab === 'App and System') && (
            <div className="text-center py-12">
              <p className="text-lendsqr-gray">No {activeTab.toLowerCase()} information available for this user.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;