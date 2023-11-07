import {FC} from 'react';
import styles from './PreviewComponent.module.scss';
import imageIcon from '../../../assets/images/img.png';
import {TPreviewImg} from '../SharePost';


interface IPropsPreview {
  dataImg: TPreviewImg | undefined;
  fileMetaData: string | undefined;
  curTheme: string;
  remove: (e: MouseEvent | PointerEvent) => void;
}

const PreviewComponent: FC<IPropsPreview> = ({ dataImg, fileMetaData, curTheme, remove}) => {
  function removeHandler(event: any) {
    remove(event as MouseEvent | PointerEvent);
  }

  return (
    <div className={`${styles.item} ${dataImg ? styles.hasPreview : ''}`}>
      {dataImg && 
      <div className={`${styles.remove} ${curTheme === 'darkMode' ? styles.themeDark : ''}`} 
       onClick={removeHandler}>
        &times;
      </div>
      }
      <img
        className={dataImg ? styles.previewImg : styles.img}
        src={dataImg ? (dataImg as string) : imageIcon}
        alt="Вложение к посту"
      />
      <span className={styles.addImageText}>
        {dataImg ? fileMetaData : "Прикрепить фото"}
      </span>
    </div>
  );
};

export default PreviewComponent;
