import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import styles from "../css/NavBar.module.css"

function NavBar() {
  return (
    <div className={styles.nav}>
       
            <div  className={styles.meAuto}>
                <Link  to="/"  className={styles.navbar}>Food</Link>
                <Link  to="/recipe"  className={styles.navbar}>Recipe</Link>
                <Link  to="/food"  className={styles.navbar}>Queue</Link>
                <Link  to="/queue"  className={styles.navbar}>My Account</Link>
            </div>
        
    </div>
  );
}

export default NavBar;