import styles from '../css/ItemHeader.module.css';
export default function ItemHeader(props){
    return( <div className={styles.headerContainer} >
                <div className={styles.imageContainer} >
                <h4 className={styles.title}>{props.title}</h4>
                <img className={styles.image} src={props.src} alt={props.alt} ></img>
                
             
                </div>
            </div>
    )
}