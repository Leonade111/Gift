import Link from 'next/link';
import Image from 'next/image';

export default function MainPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Main Content */}
        <div className="container mx-auto px-6 pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Find the Perfect Gift
                <span className="block text-orange-600 mt-2">For Your Loved Ones</span>
              </h1>
              <p className="text-xl text-gray-600">
                Discover thoughtful and personalized gift recommendations based on interests, 
                occasions, and relationships. Let us help you make every moment special.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/start"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold tracking-wide text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Start Exploring
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/category"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold tracking-wide text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-orange-300 hover:text-orange-500 transform transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Browse Categories
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative lg:block">
              <div className="relative w-full h-[400px] lg:h-[500px]">
                <Image
                  src="/images/gift.png"
                  alt="Gift Box"
                  width={500}
                  height={500}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Personalized Recommendations</h3>
              <p className="text-gray-600">Get tailored gift suggestions based on personality and interests.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Curated Categories</h3>
              <p className="text-gray-600">Browse through carefully selected gift categories for any occasion.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Smart Profiles</h3>
              <p className="text-gray-600">Create and manage gift profiles for your loved ones.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
