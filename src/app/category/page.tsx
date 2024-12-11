import MainPage from "./MainPage"; // 默认导入 MainPage 组件
import Footer from "./footer"; // 假设 Footer 位于同一文件夹中

export default function StartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 text-gray-800">
      {/* 顶部标题部分 */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-6 flex justify-center items-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
            🎁 Gift Showcase
          </h1>
        </div>
      </header>

      {/* 主内容部分 */}
      <main className="flex-grow max-w-7xl mx-auto py-10 px-6">
        <MainPage />
      </main>

      {/* 页脚部分 */}
      <Footer />
    </div>
  );
}
