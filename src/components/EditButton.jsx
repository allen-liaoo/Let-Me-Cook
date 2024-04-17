import styles from '../css/Buttons.module.css';
export default function EditButton({...props}){
    return <div>
        <button className={styles.editButton} {...props}> Edit </button>
    </div>
}