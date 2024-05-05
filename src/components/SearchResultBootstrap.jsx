import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Layout from "../css/ItemPageLayout.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import FoodItem from './FoodItem'; // Importing the FoodItem component for edit mode

export default function SearchResult({ name, image, url, buttonComp }) {
  const [editMode, setEditMode] = useState(false); // State for managing edit mode

  // Function to handle click event of the "+" button
  const handleAddButtonClick = () => {
    setEditMode(true);
  };

  if (editMode) {
    return (
      <Container className={Layout.text}>
        {/* Render FoodItem component in edit mode */}
        <FoodItem food={{ name: name, image: image }} />
      </Container>
    );
  } else {
    return (
      <Container className={Layout.text}>
        <Card>
          <Card.Body>
            <div className={styles.innerBodyContainer}>
              <Card.Img className={styles.cardImg} src={image} />
              <div className={styles.cardTextContainer}>
                <Card.Text className={styles.cardText}>{name}</Card.Text>
              </div>
              {/* Handle click event of the "+" button */}
              {buttonComp ? (
                buttonComp
              ) : (
                <button
                  className={styles.iconContainer + " " + styles.addButton}
                  onClick={handleAddButtonClick}
                >
                  +
                </button>
              )}
            </div>
          </Card.Body>
          {url ? (
            <ListGroup.Item className="list-group-flush">
              <ListGroup.Item className={Layout.text + " list-group-flush"}>
                <a href={url}> {url}</a>
              </ListGroup.Item>
            </ListGroup.Item>
          ) : (
            <></>
          )}
        </Card>
      </Container>
    );
  }
}
