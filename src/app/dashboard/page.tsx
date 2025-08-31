import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import SMSTester from "@/components/shared/sms-tester";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8 animate-slide-up">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-green-400 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=`60` height=`60` viewBox=`0 0 60 60` xmlns=`http://www.w3.org/2000/svg`%3E%3Cg fill=`none` fill-rule=`evenodd`%3E%3Cg fill=`%23ffffff` fill-opacity=`0.1`%3E%3Ccircle cx=`30` cy=`30` r=`2`/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🌾</span>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">TanimBuddy Dashboard</h1>
                <p className="text-green-100 text-lg">
                  AI-powered SMS advisory for Filipino farmers 
                  <span className="ml-2 inline-flex items-center gap-1">
                    🇵🇭 <span className="text-sm">Tagalog • Cebuano • Ilocano</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👨‍🌾</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Farmers</p>
                <p className="text-2xl font-bold text-gray-900">2,847</p>
                <p className="text-xs text-green-600">↗ +12% this month</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Messages Today</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-green-600">↗ +8% vs yesterday</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">AI Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-xs text-green-600">BantayANI responses</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Coverage Areas</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-xs text-green-600">Provinces served</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</span>
                    <div className="text-left">
                      <div className="font-semibold">View Messages</div>
                      <div className="text-xs opacity-90">Recent conversations</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📢</span>
                    <div className="text-left">
                      <div className="font-semibold">Send Alert</div>
                      <div className="text-xs opacity-90">Broadcast to farmers</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📊</span>
                    <div className="text-left">
                      <div className="font-semibold">Analytics</div>
                      <div className="text-xs opacity-90">Usage insights</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  className="h-16 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">⚙️</span>
                    <div className="text-left">
                      <div className="font-semibold">System Health</div>
                      <div className="text-xs opacity-90">Check status</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'Farmer from Cebu asked about rice planting', type: 'message', icon: '🌾' },
                  { time: '8 min ago', action: 'Weather alert sent to 127 farmers in Luzon', type: 'alert', icon: '🌧️' },
                  { time: '15 min ago', action: 'New farmer registered from Mindanao', type: 'user', icon: '🤠' },
                  { time: '23 min ago', action: 'Pest control advice given for corn crops', type: 'advice', icon: '🌽' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/40 rounded-xl border border-white/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'message' ? 'bg-blue-500' :
                      activity.type === 'alert' ? 'bg-orange-500' :
                      activity.type === 'user' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced SMS Tester */}
          <div className="lg:col-span-1">
            <SMSTester />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">TanimBuddy Features</h3>
            <p className="text-gray-600">Empowering Filipino farmers with cutting-edge AI technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl text-white">🗣️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Multi-Language Support</h4>
              <p className="text-sm text-gray-600">Tagalog, Cebuano, Ilocano, and English support for nationwide coverage</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl text-white">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">SMS-Based Access</h4>
              <p className="text-sm text-gray-600">Works on any basic phone - no internet or smartphone required</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl text-white">🧠</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Advice</h4>
              <p className="text-sm text-gray-600">BantayANI engine provides contextual farming guidance</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}