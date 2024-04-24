import styles from '../css/ItemHeader.module.css';
import { ReactComponent as UploadImage }  from '../assets/upload.svg'

export default function ItemHeaderEditable({ name, image, alt, updateName, updateImage }){
    async function uploadImage(e) {
        if (e.target.files.length <= 0) return
        const file = e.target.files.item(0);
        console.log("Image selected", file)
        if (file.size() > 10000000) {    // 10,000,000 bytes = 10 mb
            console.alert("Image file is too large (> 10mb)!")
            return
        }
        updateImage(file)
    }

    return <div className={styles.headerContainer} >
        <div className={styles.imageContainer} >
            <input className={styles.inputTitle} 
                value={name} onInput={(e)=>updateName(e.target.value)}
                maxLength="50" />
            <div className={styles.imageUpload}>
                <label for="file-input">
                    <img className={styles.image} src={image} alt={alt} ></img>
                </label>
                {/* Upload image */}
                <UploadImage className={styles.uploadSvg}/>
                <input id="file-input" type="file" accept="image/*" capture="environment"
                    onChange={uploadImage} />
            </div>
        </div>
    </div>
}