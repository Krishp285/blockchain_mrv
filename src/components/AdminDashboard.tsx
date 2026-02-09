import React, { useState } from 'react';
import { Users, FileCheck, AlertTriangle, TrendingUp, Calendar, MapPin, Award, Settings } from 'lucide-react';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface AdminDashboardProps {
  onNavigate: (view: ActiveView) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const pendingApprovals = [
    {
      id: 1,
      projectName: 'Gujarat Mangrove Expansion',
      ngo: 'Coastal Conservation Trust',
      submissionDate: '2024-01-16',
      creditsRequested: 1200,
      priority: 'High',
      validationScore: 96,
    },
    {
      id: 2,
      projectName: 'Andhra Pradesh Seagrass Restoration',
      ngo: 'Blue Wave Foundation',
      submissionDate: '2024-01-15',
      creditsRequested: 800,
      priority: 'Medium',
      validationScore: 87,
    },
    {
      id: 3,
      projectName: 'Maharashtra Salt Marsh Recovery',
      ngo: 'Green Coast Initiative',
      submissionDate: '2024-01-14',
      creditsRequested: 1500,
      priority: 'Low',
      validationScore: 91,
    },
  ];

  const adminStats = [
    { label: 'Pending Approvals', value: '23', icon: FileCheck, color: 'yellow' },
    { label: 'Total NGOs', value: '147', icon: Users, color: 'blue' },
    { label: 'Active Projects', value: '89', icon: TrendingUp, color: 'emerald' },
    { label: 'Credits Issued', value: '2.3M', icon: Award, color: 'purple' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'approvals', label: 'Pending Approvals', icon: FileCheck },
    { id: 'projects', label: 'All Projects', icon: MapPin },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleApprove = (id: number) => {
    const project = pendingApprovals.find((item) => item.id === id);
    const name = project ? project.projectName : `Project ${id}`;
    setActionMessage(`Approved ${name}. Credits will be issued after final registry checks.`);
  };

  const handleReject = (id: number) => {
    const project = pendingApprovals.find((item) => item.id === id);
    const name = project ? project.projectName : `Project ${id}`;
    setActionMessage(`Revision requested for ${name}. The NGO has been notified.`);
  };

  const handleViewDetails = (id: number) => {
    const project = pendingApprovals.find((item) => item.id === id);
    const name = project ? project.projectName : `Project ${id}`;
    setActionMessage(`Opening details for ${name}. Full dossier will appear here in production.`);
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">NCCR Admin Dashboard</h1>
            <p className="text-xl text-white/70">National Centre for Coastal Research - Administrative Panel</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium">
              System Online
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Back to Registry
            </button>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-8 w-8 text-${stat.color}-400`} />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <FileCheck className="h-8 w-8 mb-3" />
                  <div>Review Pending</div>
                  <div className="text-sm opacity-80">23 submissions</div>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Award className="h-8 w-8 mb-3" />
                  <div>Issue Credits</div>
                  <div className="text-sm opacity-80">Batch approval</div>
                </button>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Settings className="h-8 w-8 mb-3" />
                  <div>System Config</div>
                  <div className="text-sm opacity-80">Update parameters</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
              </div>
              <div className="divide-y divide-white/10">
                {[
                  { action: 'Project Approved', project: 'Kerala Backwater Restoration', time: '2 hours ago', type: 'success' },
                  { action: 'Credits Issued', project: 'Sundarbans Conservation', time: '4 hours ago', type: 'info' },
                  { action: 'New Submission', project: 'Gujarat Mangrove Expansion', time: '6 hours ago', type: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'success' ? 'bg-emerald-400' :
                        activity.type === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
                      }`}></div>
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-white/60 text-sm">{activity.project}</div>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'approvals' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
            </div>

            {actionMessage && (
              <div className="px-6 pt-6">
                <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 rounded-2xl px-5 py-4">
                  {actionMessage}
                </div>
              </div>
            )}
            
            <div className="divide-y divide-white/10">
              {pendingApprovals.map((project) => (
                <div key={project.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{project.projectName}</h3>
                      <p className="text-white/70">{project.ngo}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">{project.creditsRequested.toLocaleString()}</div>
                        <div className="text-white/60 text-sm">credits requested</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                        project.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {project.priority} Priority
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.submissionDate}</span>
                      </div>
                      <div>Validation Score: <span className="text-emerald-400 font-medium">{project.validationScore}%</span></div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Approve & Issue Credits
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Request Revision
                    </button>
                    <button
                      onClick={() => handleViewDetails(project.id)}
                      className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'projects' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">All Projects</h2>
            </div>
            <div className="p-6">
              <div className="text-center text-white/70 py-12">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Comprehensive project management interface would be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">System Settings</h2>
            </div>
            <div className="p-6">
              <div className="text-center text-white/70 py-12">
                <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>System configuration and administrative controls would be available here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}