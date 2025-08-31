/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';

// Mock farmer data
const MOCK_FARMERS = [
  {
    id: 'F001',
    name: 'Juan Santos',
    phoneNumber: '+639171234567',
    location: 'Cabanatuan, Nueva Ecija',
    language: 'Tagalog',
    crops: ['Palay', 'Mais'],
    registeredDate: '2024-01-15',
    lastActive: '2024-01-20',
    messagesCount: 23,
    status: 'active'
  },
  {
    id: 'F002',
    name: 'Maria Cruz',
    phoneNumber: '+639221234568',
    location: 'Cebu City, Cebu',
    language: 'Cebuano',
    crops: ['Kamatis', 'Talong'],
    registeredDate: '2024-01-12',
    lastActive: '2024-01-19',
    messagesCount: 45,
    status: 'active'
  },
  {
    id: 'F003',
    name: 'Pedro Reyes',
    phoneNumber: '+639331234569',
    location: 'Vigan, Ilocos Sur',
    language: 'Ilocano',
    crops: ['Palay', 'Sili'],
    registeredDate: '2024-01-08',
    lastActive: '2024-01-18',
    messagesCount: 12,
    status: 'active'
  },
  {
    id: 'F004',
    name: 'Carmen Dela Cruz',
    phoneNumber: '+639441234570',
    location: 'Davao City, Davao',
    language: 'Tagalog',
    crops: ['Saging', 'Mais'],
    registeredDate: '2024-01-05',
    lastActive: '2024-01-15',
    messagesCount: 67,
    status: 'active'
  },
  {
    id: 'F005',
    name: 'Roberto Garcia',
    phoneNumber: '+639551234571',
    location: 'Baguio, Benguet',
    language: 'English',
    crops: ['Lettuce', 'Carrots'],
    registeredDate: '2023-12-28',
    lastActive: '2024-01-10',
    messagesCount: 8,
    status: 'inactive'
  }
];

export default function FarmersPage() {
  const [farmers, setFarmers] = useState(MOCK_FARMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmer Management</h1>
            <p className="text-gray-600">Manage registered farmers and their profiles</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <span className="mr-2">➕</span>
            Add New Farmer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🤠</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-2xl font-bold text-gray-900">{farmers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Farmers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {farmers.filter(f => f.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {farmers.reduce((sum, f) => sum + f.messagesCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🌍</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provinces</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(farmers.map(f => f.location.split(',')[1]?.trim())).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search farmers by name, location, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {/* <Button variant="outline">
                <span className="mr-2">📊</span>
                Export
              </Button> */}
            </div>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Farmer</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Contact</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Location</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Crops</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Messages</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">🤠</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{farmer.name}</div>
                          <div className="text-sm text-gray-500">ID: {farmer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{farmer.phoneNumber}</div>
                      <div className="text-xs text-gray-500">{farmer.language}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{farmer.location}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {farmer.crops.map((crop) => (
                          <span key={crop} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{farmer.messagesCount}</div>
                      <div className="text-xs text-gray-500">Last: {formatDate(farmer.lastActive)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(farmer.status)}`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedFarmer(farmer)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredFarmers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-500">No farmers found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Farmer Detail Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Farmer Profile</h2>
              <Button 
                variant="outline"
                onClick={() => setSelectedFarmer(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🤠</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedFarmer.name}</h3>
                  <p className="text-gray-600">{selectedFarmer.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-gray-900">{selectedFarmer.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Language</label>
                  <p className="text-gray-900">{selectedFarmer.language}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Registered</label>
                  <p className="text-gray-900">{formatDate(selectedFarmer.registeredDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Active</label>
                  <p className="text-gray-900">{formatDate(selectedFarmer.lastActive)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Messages</label>
                  <p className="text-gray-900">{selectedFarmer.messagesCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedFarmer.status)}`}>
                    {selectedFarmer.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Crops Grown</label>
                <div className="flex flex-wrap gap-2">
                  {selectedFarmer.crops.map((crop: string) => (
                    <span key={crop} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      🌱 {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}