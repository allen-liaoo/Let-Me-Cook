import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from "../css/NavbarBootstrap.module.css";
import { Link } from 'react-router-dom'
import Layout from "../css/ItemPageLayout.module.css";

function ColorSchemesExample() {
  return (
    <>
      <Navbar className = {styles.container} sticky="top" >
        <Container>
          <Navbar.Brand href="/" className = {styles.removewhensmall}>Let Me Cook</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/foods">Food</Nav.Link>
            <Nav.Link as={Link} to="/recipes">Recipes</Nav.Link>
            <Nav.Link as={Link} to="/queue">Queue</Nav.Link>
            <Nav.Link href="/.auth/logout">Logout</Nav.Link>
            {/* TODO make align on far-right of navbar */}
            {/* <Nav>
              <Nav.Offcanvas className="justify-content-end" href="/.auth/logout" placement="end">Logout</Nav.Offcanvas>
            </Nav> */}
          </Nav>
        </Container>
      </Navbar>

      </>
  );
}


export default ColorSchemesExample;