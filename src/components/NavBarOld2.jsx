import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/NavBar.module.css"

function NavBar() {
  return (
    <div className={styles.nav}>
        <Navbar expand="lg" fixed="bottom" fluid="true">
            <Nav justify variant="tabs" className={styles.meAuto}>
                <Nav.Link as={Link} to="/"  className={styles.navbar}>Food</Nav.Link>
                <Nav.Link as={Link} to="/myform"  className={styles.navbar}>Recipe</Nav.Link>
                <Nav.Link as={Link} to="/myform"  className={styles.navbar}>Queue</Nav.Link>
                <Nav.Link as={Link} to="/myform"  className={styles.navbar}>My Account</Nav.Link>
            </Nav>
        </Navbar>
    </div>
  );
}

export default NavBar;