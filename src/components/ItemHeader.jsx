import styles from '../css/ItemHeader.module.css';
export default function ItemHeader({ name, image, alt }){
    return <div className={styles.headerContainer} >
        <div className={styles.imageContainer} >
        <h4 className={styles.title}>{name}</h4>
        <img className={styles.image} src={image} alt={alt} ></img>
        </div>
    </div>
}