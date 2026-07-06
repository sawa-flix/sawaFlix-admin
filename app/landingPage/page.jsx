'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithPassword } from '../(auth)/actions';

const LandingPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinAsCreator = () => {
    router.push('/creator/verify');
  };

  const handleJoinAsUser = () => {
    router.push('/login');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await signInWithPassword(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(result.redirectTo || '/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:flex">

      {/* Left Side - Only for Desktop */}
      <div className="hidden lg:flex w-1/2 h-[100vh] relative">
        <Image
          src="/cameroon.jpg"
          alt="Cameroon Entertainment - Music and Movies"
          fill
          className="object-cover"
          priority
        />
        {/* Desktop Content Overlay */}
        <div className="absolute inset-0 z-10 bg-black opacity-70 flex items-center justify-center px-4">
          <div className="lg:max-w-lg lg:mx-auto lg:w-full">
            <div className="text-center mb-12">
              {/* <h1 className="text-white text-5xl font-bold tracking-wide">SAWAFLIX</h1> */}
            </div>
            <div className="mb-12">
              <p className='bg-red-600 w-[100px] text-center rounded-md'>SawaFlix ✨</p>
              <h2 className="text-5xl font-bold text-white mb-6">
                Welcome to Cameroon's Premier Entertainment Hub
              </h2>

              <div className="space-y-4 text-gray-200 leading-relaxed text-lg">
                {/* <p>
                  Discover the rich tapestry of Cameroonian cinema and music all in one place. SAWAFLIX is your 
                  gateway to authentic local content, featuring blockbuster movies and chart-topping hits from 
                  your favorite Cameroonian artists.
                </p> */}

                <p className=" text-white ">
                  Stream unlimited content and stay connected with Cameroon's dynamic entertainment scene.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => router.push('/login')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/sign-up')}
                className="w-full bg-white hover:bg-white/10 text-black cursor-pointer font-bold py-5 px-8 rounded-xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Sign Up
              </button>
            </div>
            <div className="mt-12 text-center">
              <div className="bg-white bg-opacity-90 border border-white rounded-xl p-6">
                <p className="text-sm text-gray-700 mb-2">
                  🎬 Over 1,000+ Cameroonian Movies & Shows
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  🎵 Unlimited Access to Local Music
                </p>
                <p className="text-sm text-gray-700">
                  🌟 Join 50,000+ users enjoying premium content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 lg:px-12 py-12 relative z-20">
        <div className="bg-[#151C25]/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-800/50 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

        {/* Mobile View */}
        <div className="lg:hidden min-h-screen relative overflow-hidden">

          {/* Mobile Header and Buttons at Top */}
          <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-12 pb-6">
            <div className="flex items-center mb-2">
              <button className="flex items-center">
                <div className="w-6 h-6 bg-yellow-400 rounded mr-2 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[4px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
                </div>
                <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Buttons at top */}
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                Get Started
              </button>

            </div>
          </div>

          {/* Mobile Content Area - Cards at Bottom */}
          <div className="px-6 pt-72 pb-6 min-h-screen flex flex-col">

            {/* Trending Section */}
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-4">Trending</h2>

              {/* Movie Posters */}
              <div>
                {/* First Row */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="aspect-[2/3] bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <Image
                      src="/cameroon4.jpg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-xs font-bold">THE BEEKEEPER</h3>
                    </div>
                  </div>
                  <div className="aspect-[2/3] bg-green-800 rounded-lg overflow-hidden relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white text-lg font-bold mb-1">Breaking</div>

                      <Image
                        src="/pic1.jpeg"
                        alt="Breaking Bad"
                        fill
                        className="object-cover"
                      />

                      <div className="text-white text-lg font-bold">Bad</div>

                    </div>
                  </div>
                  <div className="aspect-[2/3] bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg overflow-hidden relative">
                    <Image
                      src="/cameroon.jpg"
                      alt="Breaking Bad"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-xs font-semibold">ANIME</div>
                        <Image
                          src="/wed-image 1.jpg"
                          alt="Breaking Bad"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="aspect-[2/3] bg-gradient-to-br from-green-600 to-teal-700 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <Image
                      src="/CeCe Winans.jpeg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[2/3] bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <Image
                      src="/cameroon.jpg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-1 bg-blue-400 transform rotate-45"></div>
                      <div className="w-8 h-1 bg-red-500 transform -rotate-45"></div>
                    </div>
                  </div>
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <Image
                      src="/cameroon2.jpg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-[2/3] bg-gradient-to-br from-red-800 to-black rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-red-900 bg-opacity-60"></div>
                    <Image
                      src="/cameroon3.jpg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[2/3] bg-gradient-to-br from-blue-800 to-teal-900 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
                    <Image
                      src="/pic2.jpeg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[2/3] bg-gradient-to-br from-green-700 to-yellow-600 rounded-lg overflow-hidden relative">
                    <Image
                      src="/pic4.jpeg"
                      alt="The Beekeeper"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSignIn}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[#0B0E14] border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0B0E14] border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300 transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 bg-gray-900 border-gray-800 rounded checked:bg-red-600 transition-all cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-red-700 hover:text-red-600 font-bold">Forgot password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-red-900/20 transition-all transform active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;