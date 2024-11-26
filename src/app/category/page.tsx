// StartPage.jsx
import MainPage from "./MainPage";  // 默认导入 MainPage 组件
import Footer from "./footer"; // 假设 Footer 位于 components 文件夹中

export default function StartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 主内容部分 */}
      <main className="flex-grow">
        <MainPage />
      </main>
      {/* 页脚部分 */}
      <Footer />
    </div>
  );
}
