import { useNavigate } from 'react-router-dom'
import styles from '../css/ItemHeader.module.css';

export default function ItemHeader({ name, image, alt, editLink }){
    const navigate = useNavigate()
    return <div className={styles.headerContainer} >
        <div className={styles.imageContainer} >
        <h4 className={styles.title}>{name}</h4>
        <img className={styles.image} src={image} alt={alt} ></img>
        <button className={styles.editButton} onClick={()=>navigate(editLink)}>Edit</button>
        </div>
    </div>
}