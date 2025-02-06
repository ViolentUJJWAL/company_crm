import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Layout from "./Layout/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout>
        <h1 className="text-3xl bg-red-500 font-bold">
          Hello, world!
          <br />
          Frontend Setup
        </h1>
      </Layout>
    </>
  );
}

export default App;
