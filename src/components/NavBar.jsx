import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import styles from "../css/NavBar.module.css"

function NavBar() {
  return (
    <div className={styles.navbar}>
       
  
                <Link  to="/foods"  className={styles.navlink}>Food</Link>
                <Link  to="/recipes"  className={styles.navlink}>Recipe</Link>
                <Link  to="/queue"  className={styles.navlink}>Queue</Link>
                <Link  to="/"  className={styles.navlink}>My Account</Link>
        
        
    </div>
  );
}

export default NavBar;