import styles from '../css/Buttons.module.css';
export default function SaveButton({...props}) {
    return <div>
        <button className={styles.saveButton} {...props}> Save </button>
    </div>
}