import Image from 'next/image';
import Link from 'next/link';

export default function MainPage() {
  return (
    <main className="bg-gradient-to-r from-pink-100 via-yellow-100 to-orange-100 text-gray-800 py-16">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="grid items-center justify-items-start gap-8 sm:gap-20 lg:grid-cols-2">
          {/* Main Content */}
          <div className="flex flex-col">
            <h1 className="mb-4 text-4xl font-extrabold md:text-6xl text-yellow-800">
              Begin your customized gift!
            </h1>
            <p className="mb-6 max-w-lg text-sm text-gray-600 sm:text-xl md:mb-10 lg:mb-12">
              If you&aposre unsure about what gift to send, click the button below to start!
            </p>
            <div className="flex items-center space-x-5">
              {/* "Let's start!" Button */}
              <Link
                href="/start"
                className="flex items-center rounded-md bg-gradient-to-r from-pink-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg
                transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 active:brightness-125 active:shadow-2xl active:bg-gradient-to-r from-orange-500 to-pink-600"
              >
                Let&aposs start!
              </Link>

              {/* "View the trend" Button */}
              <Link
                href="/category"
                className="flex max-w-full items-center font-bold text-gray-700 rounded-md px-3 py-2 transition-all duration-300 ease-in-out
                  hover:text-orange-600 hover:bg-gray-200 active:bg-gray-300 active:border active:border-orange-500 active:shadow-md transform hover:scale-105"
              >
                <img
                  src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94bd85e6cf98_ArrowUpRight%20(4).svg"
                  alt="Arrow Icon"
                  className="mr-2 inline-block max-h-4 w-5 transition-transform duration-300 transform hover:translate-x-1"
                />
                <p>View the category</p>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <Image
            src="/images/gift.png"  // 修改为你的图片路径
            alt="Customized Gift"
            width={500}
            height={500}
            className="inline-block h-full w-full max-w-2xl"
          />
        </div>
      </div>
    </main>
  );
}
