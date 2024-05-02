import AddButton from '../../components/AddButton';
import styles from "../../css/Queue.module.css";
import QueueItem from "../../components/QueueItem";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function RecipeQueue() {
  // Tried to have items as a state, didn't work well because we can't map a state if it's set as an empty array
  const [ items, setItems ] = useState([{name: "Apple Pen", ingredients: ["Pen", "Apple"], image: 'https://cdn3.iconfinder.com/data/icons/design-n-code/100/272127c4-8d19-4bd3-bd22-2b75ce94ccb4-512.png' }, {name: "Pineapple Pen", ingredients: ["Pen", "Pineapple"], image: 'https://cdn3.iconfinder.com/data/icons/design-n-code/100/272127c4-8d19-4bd3-bd22-2b75ce94ccb4-512.png' }, {name: "PenPineappleApplePen", ingredients: ["Apple Pen", "Pineapple Pen"], image: 'https://i.ytimg.com/vi/Ct6BUPvE2sM/maxresdefault.jpg'}])
  const [ draggingItem, setDraggingItem ] = useState(null);
  const [ newItemName, setNewItemName ] = useState('');
  const [ newItemImage, setNewItemImage ] = useState('');
  const navigate = useNavigate()

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  }

  const handleDragOver = (e) => {
    // console.log(e)
    e.preventDefault();
  }

  const handleDrop = (e, targetItem) => {
    // TODO: Come back to this as the first place to look if not working
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      items.splice(currentIndex, 1);
      items.splice(targetIndex, 0, draggingItem);
      setItems(items);
    }
  }

  const handleNameChange = (e) => {
    setNewItemName(e.target.value);
  }

  const handleImageChange = (e) => {
    setNewItemImage(e.target.value);
  }
  useEffect(() => {
    async function getQueue() {
      const res = await fetch("/api/queue", {
        method: "GET",
      });
      if (res.ok) {
        console.log(await res.json())
      }
      // const recipes = await res.json()
      // console.log(recipes)
      // setItems(recipes.data)
  }
 
  let ignore = false;

  if (!ignore)  getQueue()
  return () => { ignore = true; }
  // getQueue();
    
  }, [])

  return (
    <div>
      <p>Recipe queue</p>
      <div className={styles.queueList} align="left">
        {items.map(item => (
          <div
            className=
              {`${styles.grow} ${item === draggingItem ?
                'dragging' : ''
              }`}
            draggable="true"
            onDragStart={ (e) =>
              handleDragStart(e, item) }
            onDragEnd={() => handleDragEnd()}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={ (e) => handleDrop(e, item)}
          >
            <QueueItem 
              itemName={item.name} 
              ingredients={item.ingredients} 
              image={item.image}
              handleNameChange={handleNameChange} 
              handleImageChange={handleImageChange}
              >
            </QueueItem>
          </div>
        ))}
        
      </div>
      <div className={styles.footer}>
        {/* <AddButton onClick={()=>{navigate('/queue/create')}}/> */}
        {/* <button onClick={addNewItem}>+</button> */}
      </div>
    </div>
  );
}
