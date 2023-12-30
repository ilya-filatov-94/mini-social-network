import {FC, memo} from 'react';
import styles from './PreviewAttach.module.scss';
import imageIcon from '../../../assets/images/img-attach-chat.png';
import fileIcon from '../../../assets/images/attach-chat.png';

export type TPreviewImg = string | ArrayBuffer | null;

interface IPropsPreviewAttach {
  dataImg: TPreviewImg | undefined;
  curTheme: string;
  remove: (e: MouseEvent | PointerEvent) => void;
  previewAttach: string;
}

const PreviewAttach: FC<IPropsPreviewAttach> = memo(({
  dataImg, 
  curTheme, 
  remove,
  previewAttach
}) => {
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
      {previewAttach === 'img' &&
        <img
            className={dataImg ? styles.previewImg : styles.img}
            src={dataImg ? (dataImg as string) : imageIcon}
            alt="Вложение к сообщению"
        />
      }
      {previewAttach === 'file' &&
        <img
            className={dataImg ? styles.previewImg : styles.img}
            src={dataImg ? (dataImg as string) : fileIcon}
            alt="Вложение к сообщению"
        />
      }
    </div>
  );
});

export default PreviewAttach;
