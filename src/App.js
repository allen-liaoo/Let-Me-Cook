import { Link, Outlet } from "react-router-dom";
import NavBar from "./components/Navbarbootstrap";
// import NavBarOld2 from "./components/NavBarOld2";
import "./css/page.css"
function App() {
  return (
    <div>
    {/* <Link to="">Landing</Link><br />
    <Link to="/food/1">Food</Link><br />
    <Link to="/food/edit/1">Food Edit</Link><br />
    <Link to="/food/create">Food Create</Link><br />
    <Link to="/recipes">Recipes</Link><br />
    <Link to="/recipe/1">Recipe indiviual</Link><br />
    <Link to="/recipe/edit/1">Recipes</Link><br />
    <Link to="/recipe/create">Recipes create</Link><br />
    <Link to="/queue">Queue</Link><br /> */}
    
    {/* <ItemHeader  src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg" 
    alt = "tomato" title = "Tomato"></ItemHeader>
     <ItemHeaderEditable  src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg" 
    alt = "tomato" title = "Tomato"></ItemHeaderEditable > */}
    <NavBar></NavBar>
    <div className="content">
    <Outlet />
    </div>
    
    </div>
  );
}

export default App;
