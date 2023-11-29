import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./Components/Signin";
import Chatroom from "./Components/Chatroom";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signin />}></Route>
            <Route path="/Chatroom" element={<Chatroom />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
