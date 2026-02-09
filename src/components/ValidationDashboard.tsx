import React, { useState } from 'react';
import { Eye, MapPin, Calendar, CheckCircle, XCircle, Clock, Satellite, Camera, Zap } from 'lucide-react';
import {
  mlApi,
  type RestorationClassificationResponse,
  type RiskScoringResponse,
} from '../lib/mlApi';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface ValidationDashboardProps {
  onNavigate: (view: ActiveView) => void;
}

export function ValidationDashboard({ onNavigate }: ValidationDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [mlInsights, setMlInsights] = useState<Record<number, {
    restoration?: RestorationClassificationResponse;
    risk?: RiskScoringResponse;
  }>>({});
  const [mlLoading, setMlLoading] = useState<Record<number, boolean>>({});
  const [mlError, setMlError] = useState<Record<number, string | null>>({});

  const projects = [
    {
      id: 1,
      name: 'Sundarbans Mangrove Conservation',
      ngo: 'EcoRestore India',
      location: 'West Bengal',
      date: '2024-01-15',
      status: 'pending',
      area: 75,
      seedlings: 2500,
      confidence: 94,
      aiScore: 'High',
    },
    {
      id: 2,
      name: 'Kerala Backwater Restoration',
      ngo: 'Coastal Guard Foundation',
      location: 'Kerala',
      date: '2024-01-14',
      status: 'approved',
      area: 45,
      seedlings: 1800,
      confidence: 98,
      aiScore: 'Very High',
    },
    {
      id: 3,
      name: 'Tamil Nadu Seagrass Recovery',
      ngo: 'Marine Life Protectors',
      location: 'Tamil Nadu',
      date: '2024-01-13',
      status: 'rejected',
      area: 30,
      seedlings: 0,
      confidence: 45,
      aiScore: 'Low',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-emerald-400 bg-emerald-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const fetchMlInsights = async (project: typeof projects[number]) => {
    if (mlInsights[project.id] || mlLoading[project.id]) {
      return;
    }

    setMlLoading((prev) => ({ ...prev, [project.id]: true }));
    setMlError((prev) => ({ ...prev, [project.id]: null }));

    const confidenceScore = project.confidence / 100;
    const acceptanceRate = project.status === 'approved' ? 0.92 : project.status === 'pending' ? 0.75 : 0.55;

    try {
      const [restoration, risk] = await Promise.all([
        mlApi.classifyRestoration({
          ndvi_change: Math.min(1, confidenceScore),
          vegetation_cover_percent: project.confidence,
          time_interval_months: 12,
          area_consistency_score: Math.min(1, confidenceScore + 0.05),
        }),
        mlApi.scoreRisk({
          image_authenticity_score: Math.min(1, confidenceScore),
          satellite_confidence_score: Math.max(0.4, confidenceScore - 0.08),
          ngo_historical_acceptance_rate: acceptanceRate,
          upload_frequency: project.status === 'pending' ? 6 : 3,
          location_sensitivity: project.location === 'West Bengal' ? 0.72 : 0.58,
        }),
      ]);

      setMlInsights((prev) => ({
        ...prev,
        [project.id]: { restoration, risk },
      }));
    } catch (error) {
      setMlError((prev) => ({ ...prev, [project.id]: 'ML service unavailable' }));
    } finally {
      setMlLoading((prev) => ({ ...prev, [project.id]: false }));
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">AI Validation Dashboard</h1>
            <p className="text-xl text-white/70">Automated verification using satellite imagery and machine learning</p>
          </div>
          <button
            onClick={() => onNavigate('blockchain')}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            View Blockchain Registry
          </button>
        </div>

        {/* Validation Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Pending Review', value: '23', color: 'yellow', icon: Clock },
            { label: 'AI Validated', value: '156', color: 'emerald', icon: Zap },
            { label: 'Satellite Verified', value: '89', color: 'blue', icon: Satellite },
            { label: 'Manual Review', value: '12', color: 'purple', icon: Eye },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-8 w-8 text-${stat.color}-400`} />
                  <div className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Projects List */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Recent Submissions</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {projects.map((project) => {
              const StatusIcon = getStatusIcon(project.status);
              return (
                <div 
                  key={project.id} 
                  className="p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    const nextSelected = selectedProject === project.id ? null : project.id;
                    setSelectedProject(nextSelected);
                    if (nextSelected === project.id) {
                      fetchMlInsights(project);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="h-4 w-4" />
                            <span className="capitalize">{project.status}</span>
                          </div>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-white/70 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{project.date}</span>
                        </div>
                        <div>NGO: {project.ngo}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-white font-semibold">{project.area} Ha</div>
                        <div className="text-white/60 text-sm">{project.seedlings.toLocaleString()} seedlings</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-semibold">{project.confidence}%</div>
                        <div className="text-white/60 text-sm">AI Confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedProject === project.id && (
                    <div className="mt-6 pt-6 border-t border-white/20 grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <Camera className="h-5 w-5 mr-2" />
                          Field Photos Analysis
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">Photo Quality</span>
                              <span className="text-emerald-400">Excellent</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${project.confidence}%` }}></div>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">Metadata Integrity</span>
                              <span className="text-emerald-400">Verified</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <Satellite className="h-5 w-5 mr-2" />
                          Satellite Verification
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">Vegetation Index</span>
                              <span className="text-blue-400">NDVI: 0.78</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">Area Coverage</span>
                              <span className="text-emerald-400">98.5%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <Zap className="h-5 w-5 mr-2" />
                          ML Insights
                        </h4>
                        {mlLoading[project.id] && (
                          <div className="text-white/60">Loading ML outputs...</div>
                        )}
                        {mlError[project.id] && (
                          <div className="text-red-400">{mlError[project.id]}</div>
                        )}
                        {mlInsights[project.id] && (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 rounded-lg p-4">
                              <div className="text-white/70 text-sm mb-1">Restoration Status</div>
                              <div className="text-emerald-400 font-semibold">
                                {mlInsights[project.id].restoration?.restoration_status}
                              </div>
                              <div className="text-white/60 text-sm">
                                Confidence: {((mlInsights[project.id].restoration?.confidence_score || 0) * 100).toFixed(1)}%
                              </div>
                              <div className="text-white/60 text-xs mt-2">
                                {mlInsights[project.id].restoration?.explanation}
                              </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                              <div className="text-white/70 text-sm mb-1">Risk Score</div>
                              <div className="text-yellow-400 font-semibold">
                                {mlInsights[project.id].risk?.risk_level} - {mlInsights[project.id].risk?.review_priority}
                              </div>
                              <div className="text-white/60 text-sm">
                                Confidence: {((mlInsights[project.id].risk?.confidence_score || 0) * 100).toFixed(1)}%
                              </div>
                              <div className="text-white/60 text-xs mt-2">
                                {mlInsights[project.id].risk?.explanation}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Processing Status */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Processing Pipeline</h3>
              <p className="text-white/70">Real-time validation using computer vision and satellite data</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">94.7%</div>
              <div className="text-white/70">Average Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}