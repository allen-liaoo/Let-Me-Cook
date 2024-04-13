import styles from '../css/Buttons.module.css';
export default function AddButton({...props}){
    return( <div>
            <button className={styles.AddButton} {...props}> Add </button>
        </div>
    )
}