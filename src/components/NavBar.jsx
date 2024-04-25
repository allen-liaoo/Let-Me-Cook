import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import styles from "../css/NavBar.module.css"

function NavBar() {
  return (
    <div className={styles.navbar}>
        <Link  to="/foods"  className={styles.navlink}>Foods</Link>
        <Link  to="/recipes"  className={styles.navlink}>Recipes</Link>
        <Link  to="/queue"  className={styles.navlink}>Queue</Link>
        <Link  to="/"  className={styles.navlink}>My Account</Link>
        <div className={styles.navlink}>
          <Button variant="secondary"  onClick={()=>{window.location.href="/.auth/logout"}}>Logout</Button>
        </div>
    </div>
  );
}

export default NavBar;