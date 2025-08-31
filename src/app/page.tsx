import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SMSTester from '@/components/shared/sms-tester';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-xl text-white">🌾</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">TanimBuddy</h1>
                <p className="text-xs text-green-600">AI Farming Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/login"
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                Sign in as Test Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl text-white">🌾</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering Filipino Farmers with 
              <span className="text-green-600"> AI-Powered</span> Advice
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              TanimBuddy delivers personalized farming guidance through simple SMS messages. 
              No smartphone required, works offline, and speaks your language.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-green-200">
                <span className="text-lg">🗣️</span>
                <span className="text-sm font-medium">Tagalog • Cebuano • Ilocano</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-green-200">
                <span className="text-lg">📱</span>
                <span className="text-sm font-medium">Works on Any Phone</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-green-200">
                <span className="text-lg">🇵🇭</span>
                <span className="text-sm font-medium">Made for Filipino Farmers</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="mr-2 text-xl">🚀</span>
                  View System Dashboard
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button size="lg" variant="outline" className="border-2 border-green-200 hover:bg-green-50">
                  <span className="mr-2 text-xl">🔐</span>
                  Admin Panel Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Impact, Real Numbers</h2>
            <p className="text-gray-600">TanimBuddy is already making a difference across the Philippines</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👨‍🌾</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">45,621</div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">23</div>
              <div className="text-sm text-gray-600">Provinces</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">94.2%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How TanimBuddy Works</h2>
            <p className="text-xl text-gray-600">Simple SMS technology meets advanced AI to serve Filipino farmers</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Farmer Sends SMS Question</h3>
                  <p className="text-gray-600">Farmers text their questions in their local language using any basic phone</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">BantayANI Processes Request</h3>
                  <p className="text-gray-600">Our AI engine understands the question and generates contextual farming advice</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Instant Expert Response</h3>
                  <p className="text-gray-600">Farmer receives practical advice in their language within seconds</p>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <SMSTester />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-3xl flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed text-green-100 mb-8">
            To bridge Filipino farmers to the future using accessible AI-powered tools that work offline, 
            speak their language, and restore agricultural dignity from the ground up.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl mb-3">🌾</div>
              <h3 className="font-semibold mb-2">Locally Relevant</h3>
              <p className="text-green-100 text-sm">Philippine crops, seasons, and farming practices</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Universally Accessible</h3>
              <p className="text-green-100 text-sm">Works on any phone, no internet required</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2">Culturally Respectful</h3>
              <p className="text-green-100 text-sm">Speaks Filipino languages with proper tone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white">🌾</span>
            </div>
            <span className="font-bold text-lg text-gray-900">TanimBuddy</span>
          </div>
          <p className="text-gray-600 mb-4">Powered by BantayANI • Made for Filipino Farmers</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <Link href="/admin" className="hover:text-gray-700">Admin Panel</Link>
            <span>v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}