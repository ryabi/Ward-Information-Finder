import React from 'react';
import { Landmark, Mountain, Camera, Calendar } from 'lucide-react';

const LocalCulture: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Local Culture & Tourism</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cultural Heritage Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Landmark className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">Cultural Heritage</h2>
                  <p className="text-gray-600">Discover our rich cultural traditions</p>
                </div>
              </div>

              <div className="prose max-w-none text-gray-600">
                <p>
                  Our locality is rich in cultural heritage, with traditions dating back centuries. 
                  The local community celebrates various festivals throughout the year, each with 
                  its own unique customs and significance.
                </p>
                
                <div className="mt-6">
                  <img 
                    src="https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg" 
                    alt="Local Festival Celebration" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Natural Beauty Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Mountain className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">Natural Beauty</h2>
                  <p className="text-gray-600">Explore our scenic landscapes</p>
                </div>
              </div>

              <div className="prose max-w-none text-gray-600">
                <p>
                  From pristine mountains to serene lakes, our region boasts some of the most 
                  breathtaking natural landscapes. These natural wonders provide perfect 
                  opportunities for hiking, photography, and peaceful retreats.
                </p>
                
                <div className="mt-6">
                  <img 
                    src="https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg" 
                    alt="Local Landscape" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist Attractions Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Must-Visit Places</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Historical Temples</h4>
                    <p className="text-sm text-gray-600">Ancient temples showcasing traditional architecture</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Local Markets</h4>
                    <p className="text-sm text-gray-600">Traditional bazaars with local crafts and goods</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Viewpoints</h4>
                    <p className="text-sm text-gray-600">Scenic spots offering panoramic views</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Upcoming Events</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cultural Festival</p>
                      <p className="text-xs text-gray-600">August 15-17, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Food Fair</p>
                      <p className="text-xs text-gray-600">September 5-7, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalCulture;