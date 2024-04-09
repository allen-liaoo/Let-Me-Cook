import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SaveButton from './components/SaveButton'
function App() {
  return (
    <div>
    <Link to="">Landing</Link><br />
    <Link to="/ingredients">Ingredients</Link><br />
    <Link to="/food/1">Food</Link><br />
    <SaveButton></SaveButton>
    <NavBar></NavBar>
    <Outlet />
    </div>
  );
}

export default App;
