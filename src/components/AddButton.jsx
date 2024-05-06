import styles from '../css/Buttons.module.css';
import Layout from "../css/ItemPageLayout.module.css";

export default function AddButton({...props}){
    return <div className={Layout.centerrow+" "+Layout.stickaddbutton} {...props}>
        <button className={styles.addButton}> Add </button>
    </div>
}