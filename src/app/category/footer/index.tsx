export default function Footer() {
  return (
    <footer className="bg-yellow-100 text-gray-800 py-12 mt-auto">
      <div className="mx-auto w-full max-w-7xl px-5">
        {/* 商标部分，添加背景颜色和圆角效果 */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gray-200 p-4 rounded-full">
            <img
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94d6f4e6cf96_Group%2047874-3.png"
              alt="Logo"
              className="max-h-12 mx-auto"
            />
          </div>
        </div>

        {/* 链接部分 */}
        <div className="text-center font-semibold text-gray-700 mb-8">
          <a
            href="#about"
            className="inline-block px-6 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300"
          >
            About
          </a>
          <a
            href="#features"
            className="inline-block px-6 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300"
          >
            Features
          </a>
          <a
            href="#works"
            className="inline-block px-6 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300"
          >
            Works
          </a>
          <a
            href="#support"
            className="inline-block px-6 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300"
          >
            Support
          </a>
          <a
            href="#help"
            className="inline-block px-6 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300"
          >
            Help
          </a>
        </div>

        {/* 分隔线 */}
        <div className="mb-8 mt-8 border-b border-gray-400 w-32 mx-auto"></div>

        {/* 版权部分 */}
        <p className="text-sm text-gray-500 text-center">© 2024 Leo Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
