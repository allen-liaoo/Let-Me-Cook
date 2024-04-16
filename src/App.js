import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SaveButton from './components/SaveButton'
import AddButton from './components/AddButton'
import ItemHeader from './components/ItemHeader'
import ItemHeaderEditable from './components/ItemHeaderEditable'
function App() {
  return (
    <div>
    <Link to="">Landing</Link><br />
    <Link to="/ingredients">Ingredients</Link><br />
    <Link to="/food/1">Food</Link><br />
    <SaveButton></SaveButton>
    <AddButton></AddButton>
    {/* <ItemHeader  src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg" 
    alt = "tomato" title = "Tomato"></ItemHeader>
     <ItemHeaderEditable  src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg" 
    alt = "tomato" title = "Tomato"></ItemHeaderEditable > */}
    <NavBar></NavBar>
    <Outlet />
    </div>
  );
}

export default App;
