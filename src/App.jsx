import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import routes from "@/router";
import NavBar from "@/components/NavBar";

import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import "zarm/dist/zarm.css";

function App() {
  const location = useLocation(); // 拿到 location 实例
  const { pathname } = location; // 获取当前路径
  const needNav = ["/", "/data", "/user"]; // 需要底部导航栏的路径
  const [showNav, setShowNav] = useState(false); // 是否展示NavBar
  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]); // [] 内的参数若是变化，便会执行上述回调函数=

  return (
    <ConfigProvider primaryColor={"#007fff"}>
      <>
        <Routes>
          {routes.map((route) => (
            <Route
              exact
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
        <NavBar showNav={showNav} />
      </>
    </ConfigProvider>
  );
}

export default App;
