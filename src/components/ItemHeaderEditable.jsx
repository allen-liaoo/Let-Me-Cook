import styles from '../css/ItemHeader.module.css';

export default function ItemHeaderEditable({ name, image, alt, updateName }){
    return <div className={styles.headerContainer} >
        <div className={styles.imageContainer} >
        <input className={styles.inputTitle} value={name} onInput={(e)=>updateName(e.target.value)}/>
        <img className={styles.image} src={image} alt={alt} ></img>
        <button className={styles.editButton}>Edit</button>
        </div>
    </div>
}