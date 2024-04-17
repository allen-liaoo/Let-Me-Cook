import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from "react-router-dom";
import styles from '../css/ListItem.module.css'

export default function ListItem({name, description, image, viewLink, editLink}) {
    const navigate = useNavigate()
    return (
        <Row className={styles.listItem}>
            {image ?
                <Col onClick={()=>navigate(viewLink)}>
                    <img src={image} alt="food" />
                </Col> 
                : <></>}
            <Col onClick={()=>navigate(viewLink)}>{name}</Col>
            <Col onClick={()=>navigate(viewLink)}>{description}</Col>
            <Col>
                <Link to={editLink}>Edit</Link>
            </Col>
        </Row>
    )
}
