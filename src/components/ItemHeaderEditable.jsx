import styles from '../css/ItemHeader.module.css';

export default function ItemHeaderEditable(props){
    return( <div className={styles.headerContainer} >
        <div className={styles.imageContainer} >
        <input className={styles.inputTitle} value={props.title}></input>
        
        
        <img className={styles.image} src={props.src} alt={props.alt} ></img>
        <button className={styles.editButton}>Edit</button>
        
     
        </div>
    </div>
    )

    }