import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Layout from "../css/ItemPageLayout.module.css";
import styles from "../css/NavbarBootstrap.module.css";
import { Link } from 'react-router-dom';
import { ReactComponent as Logout }  from '../assets/logout.svg'

function ColorSchemesExample() {
  return (
    <>
      <Navbar className={styles.container} sticky="top">
        <Container>
          <Navbar.Brand href="/" className={styles.removewhensmall}>Let Me Cook</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/foods">Food</Nav.Link>
            <Nav.Link as={Link} to="/recipes">Recipes</Nav.Link>
            <Nav.Link as={Link} to="/queue">Queue</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className={"ml-auto"} href="/.auth/logout">
              <div className={Layout.row}>
              <div className={styles.removewhensmall}>{"Logout  "} </div>
              <Logout className={styles.logoutIcon}/> 
              </div>
              </Nav.Link>
              
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
