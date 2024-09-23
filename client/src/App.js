import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/home_page";
import "bootstrap/dist/css/bootstrap.min.css"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>

        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
