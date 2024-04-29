import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from "../css/NavbarBootstrap.module.css";
// import Button from 'react-bootstrap/Button';

function ColorSchemesExample() {
  return (
    <>
      
      <Navbar className = {styles.container}>
        <Container>
          <Navbar.Brand href="/" className = {styles.removewhensmall}>Let Me Cook</Navbar.Brand>
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/foods"  className={styles.navbar}>Foods</Nav.Link> */}
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/foods">Food</Nav.Link>
            <Nav.Link href="/recipes">Recipes</Nav.Link>
            <Nav.Link href="/queue">Queue</Nav.Link>
            <Nav.Link href="/.auth/logout">Logout</Nav.Link>
            
          </Nav>
        </Container>
      </Navbar>

      </>
  );
}


export default ColorSchemesExample;