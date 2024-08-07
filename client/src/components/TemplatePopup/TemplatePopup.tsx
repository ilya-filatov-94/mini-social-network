import {FC, ReactNode} from 'react';
import styles from './TemplatePopup.module.scss';
import Portal from '../../hoc/Portal';
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';


interface IPopupProps {
  isVisible: boolean; 
  setVisible: () => void;
  headerPopup: ReactNode;
  contentPopup: ReactNode;
}

const TemplatePopup: FC<IPopupProps> = ({
  isVisible,
  setVisible,
  headerPopup,
  contentPopup,
}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);

  if (isVisible) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  if (!isVisible) return null;

  return (
    <Portal>
      <div className={`${styles.windowPopup} ${isVisible ? styles.active : ''}`}>
        <div className={`${styles.contentPopup} 
        ${currentTheme ==='darkMode' ? styles['theme-dark'] : styles['theme-light']}`}>
           <div className={styles.headerPopup}>
                {headerPopup}
                <CloseOutlinedIcon 
                    onClick={setVisible}
                    className={styles.closeBtn} 
                />
            </div>
            <hr />
            {contentPopup}
        </div>  
      </div>
    </Portal>
  )
}

export default TemplatePopup;