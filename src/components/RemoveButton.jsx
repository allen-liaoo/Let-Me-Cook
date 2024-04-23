import styles from '../css/Buttons.module.css';
export default function RemoveButton({...props}){
    return <div>
        <button className={styles.removeButton} {...props} > Remove </button>
    </div>
}