import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

export default function ListItem({info}) {
    const link = "/" + info.type + "/" + info._id;
    return (
        <div>
            <Container>
                <Col>
                    <img src="" alt="food"></img>
                </Col>
                <Col>
                    <Row>Food Name</Row>
                    <Row>Food Description</Row>
                </Col>
                <Col>
                    <Link to={link}>Edit</Link>
                </Col>
            </Container>
        </div>
    )
}
