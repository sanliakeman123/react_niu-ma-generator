import React from "react";

import "antd/dist/antd.css"
import "./App.css"
import {Outlet} from "react-router-dom"
import Frame from "./components/Frame/Index"

export default function App() {
  return <Frame>
  <Outlet />
</Frame>
}

