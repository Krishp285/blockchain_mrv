import React, { useState } from 'react';
import { Camera, MapPin, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { mlApi, type Co2PredictionResponse } from '../lib/mlApi';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

interface NGOUploadProps {
  onNavigate: (view: ActiveView) => void;
}

export function NGOUpload({ onNavigate }: NGOUploadProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [selectedImages, setSelectedImages] = useState<number>(0);
  const [areaRestored, setAreaRestored] = useState(75);
  const [survivalRate, setSurvivalRate] = useState(92);
  const [ecosystemType, setEcosystemType] = useState('mangrove');
  const [monthsSinceRestoration, setMonthsSinceRestoration] = useState(18);
  const [coastalZoneType, setCoastalZoneType] = useState('Tidal');
  const [co2Prediction, setCo2Prediction] = useState<Co2PredictionResponse | null>(null);
  const [co2Status, setCo2Status] = useState<'idle' | 'loading' | 'error'>('idle');
  const [co2Error, setCo2Error] = useState<string | null>(null);

  const handleImageUpload = () => {
    setSelectedImages(Math.floor(Math.random() * 5) + 3);
  };

  const handleSubmit = () => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => {
        onNavigate('validation');
      }, 2000);
    }, 3000);
  };

  const handleCo2Estimate = async () => {
    setCo2Status('loading');
    setCo2Error(null);
    const vegetationDensityIndex = Math.min(1, (survivalRate / 100) * 0.9);

    try {
      const result = await mlApi.predictCo2({
        area_restored_ha: areaRestored,
        ecosystem_type: ecosystemType,
        time_since_restoration_months: monthsSinceRestoration,
        vegetation_density_index: vegetationDensityIndex,
        coastal_zone_type: coastalZoneType,
      });
      setCo2Prediction(result);
      setCo2Status('idle');
    } catch (error) {
      setCo2Status('error');
      setCo2Error('Unable to fetch ML estimate. Check ML service.');
    }
  };

  const steps = [
    { id: 1, title: 'Project Info', icon: MapPin },
    { id: 2, title: 'Field Data', icon: Camera },
    { id: 3, title: 'Verification', icon: CheckCircle },
  ];

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Field Data Upload</h1>
          <p className="text-xl text-white/70">Upload your restoration project data for verification</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : isActive 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-white/30'
                }`}>
                  <Icon className={`h-6 w-6 ${isCompleted || isActive ? 'text-white' : 'text-white/50'}`} />
                </div>
                <div className="ml-3 mr-8">
                  <div className={`text-sm font-medium ${isCompleted || isActive ? 'text-white' : 'text-white/50'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 ${isCompleted ? 'bg-emerald-500' : 'bg-white/20'} transition-colors duration-300`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Project Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tamil Nadu Mangrove Restoration"
                    defaultValue="Sundarbans Mangrove Conservation"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">NGO Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Green Coast Foundation"
                    defaultValue="EcoRestore India"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">GPS Coordinates</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Latitude"
                    defaultValue="22.5726° N"
                  />
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Longitude"
                    defaultValue="88.3639° E"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Ecosystem Type</label>
                <select
                  value={ecosystemType}
                  onChange={(event) => setEcosystemType(event.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mangrove">Mangroves</option>
                  <option value="wetland">Wetland</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Project Description</label>
                <textarea 
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Describe your restoration project..."
                  defaultValue="Large-scale mangrove restoration covering 500 hectares of degraded coastal area. Project includes community engagement, seedling cultivation, and long-term monitoring."
                />
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Continue to Field Data
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Photo Upload */}
              <div>
                <label className="block text-white font-medium mb-4">Upload Field Photos</label>
                <div 
                  className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  onClick={handleImageUpload}
                >
                  <Camera className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg mb-2">Click to upload restoration photos</p>
                  <p className="text-white/50 text-sm">Photos should include GPS metadata and timestamps</p>
                  {selectedImages > 0 && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span>{selectedImages} photos selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Species Count */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Seedlings Planted</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                    defaultValue="2500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Area (Hectares)</label>
                  <input 
                    type="number" 
                    value={areaRestored}
                    onChange={(event) => setAreaRestored(Number(event.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Survival Rate (%)</label>
                  <input 
                    type="number" 
                    value={survivalRate}
                    onChange={(event) => setSurvivalRate(Number(event.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="85"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Months Since Restoration</label>
                  <input
                    type="number"
                    value={monthsSinceRestoration}
                    onChange={(event) => setMonthsSinceRestoration(Number(event.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Coastal Zone Type</label>
                  <select
                    value={coastalZoneType}
                    onChange={(event) => setCoastalZoneType(event.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Tidal">Tidal</option>
                    <option value="Estuarine">Estuarine</option>
                    <option value="Deltaic">Deltaic</option>
                    <option value="Lagoon">Lagoon</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white font-medium mb-2">Field Notes</label>
                <textarea 
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Additional observations and notes..."
                  defaultValue="Excellent soil conditions observed. Local community actively participating. Weather conditions favorable for growth. Initial growth rate exceeding expectations."
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">ML CO2 Estimate</h4>
                    <p className="text-white/60 text-sm">Uses restored area, ecosystem type, and field indicators.</p>
                  </div>
                  <button
                    onClick={handleCo2Estimate}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    disabled={co2Status === 'loading'}
                  >
                    {co2Status === 'loading' ? 'Estimating...' : 'Run Estimate'}
                  </button>
                </div>

                {co2Status === 'error' && (
                  <div className="text-red-400 text-sm">{co2Error}</div>
                )}

                {co2Prediction && (
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-emerald-400">
                      {co2Prediction.predicted_co2_tons_per_year} tons CO2/year
                    </div>
                    <div className="text-white/70 text-sm">{co2Prediction.explanation}</div>
                    <div className="flex flex-wrap gap-2">
                      {co2Prediction.feature_importance.map((item) => (
                        <span
                          key={item.feature}
                          className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full"
                        >
                          {item.feature}: {item.importance.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  Continue to Verification
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Data Verification</h3>
                <p className="text-white/70">Review your submission before uploading to the blockchain</p>
              </div>

              {/* Verification Checks */}
              <div className="space-y-4">
                {[
                  { check: 'GPS coordinates validated', status: 'success' },
                  { check: 'Photos contain metadata', status: 'success' },
                  { check: 'Data integrity verified', status: 'success' },
                  { check: 'Project area confirmed', status: 'success' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                    <span className="text-white">{item.check}</span>
                  </div>
                ))}
              </div>

              {/* Upload Button */}
              <div className="text-center">
                {uploadStatus === 'idle' && (
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
                  >
                    <Upload className="h-6 w-6" />
                    <span>Submit to Blockchain</span>
                  </button>
                )}
                
                {uploadStatus === 'uploading' && (
                  <div className="flex items-center justify-center space-x-3 text-blue-400">
                    <Loader className="h-8 w-8 animate-spin" />
                    <span className="text-lg">Uploading to blockchain...</span>
                  </div>
                )}
                
                {uploadStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 text-emerald-400">
                      <CheckCircle className="h-8 w-8" />
                      <span className="text-lg font-semibold">Successfully uploaded!</span>
                    </div>
                    <p className="text-white/70">Redirecting to validation dashboard...</p>
                  </div>
                )}
              </div>

              {uploadStatus === 'idle' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Real-time Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-emerald-400 mb-2">156</div>
            <div className="text-white/70">Projects Submitted Today</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">2.3M</div>
            <div className="text-white/70">Seedlings Tracked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-orange-400 mb-2">89%</div>
            <div className="text-white/70">Validation Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}