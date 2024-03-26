import { Link, Outlet } from "react-router-dom"
function App() {
  return (
    <>
    <Link to="">Landing</Link><br />
    <Link to="/ingredients">Ingredients</Link><br />
    <Link to="/food/1">Food</Link><br />
    <Outlet />
    </>
  );
}

export default App;
