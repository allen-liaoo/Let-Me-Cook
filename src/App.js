import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/Navbarbootstrap";
// import NavBarOld2 from "./components/NavBarOld2";
import "./css/page.css"
function App() {
  return (
    <div className = "body">
    <NavBar></NavBar>
    <div className="content">
      <Outlet />
    </div>
    </div>
  );
}

export default App;
