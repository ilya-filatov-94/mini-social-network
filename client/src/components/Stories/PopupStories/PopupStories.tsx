import {
  FC, 
  useEffect, 
  useState, 
  useRef,
  memo,
  useCallback
} from 'react';
import styles from './PopupStories.module.scss';
import Portal from '../../../hoc/Portal';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {IStory} from '../../../types/story';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables'; 

interface IPopupStoriesProps {
  isVisible: boolean; 
  setVisible: (state: boolean) => void;
  indexStory?: number;
  stories: IStory[];
  setCurrentIndex: (index: number | undefined) => void;
}

const PopupStories: FC<IPopupStoriesProps> = memo(({
  isVisible, 
  setVisible, 
  indexStory, 
  stories, 
  setCurrentIndex
}) => {


  const [filled, setFilled] = useState(0);
  const timeout = useRef<any>();

  useEffect(() => {
    if (isVisible) {
      if (filled < 100) {
        timeout.current = setTimeout(() => setFilled((prev) => prev + 2), 100);
      }
      if (indexStory! > stories.length) {
        closePopup();
      }
      if (filled === 100 && stories.length === indexStory!) {
        closePopup();
      }
      if (filled === 100 && stories.length > indexStory!) {
        setCurrentIndex(indexStory! + 1);
        setFilled(0);
      }
    }
    return () => clearTimeout(timeout.current);
  // eslint-disable-next-line
  }, [filled, isVisible]);

  const closePopup = useCallback(() => {
    setFilled(0);
    setVisible(!isVisible);
  }, [isVisible, setVisible]);

  if (!isVisible) return null;

  return (
    <Portal>
      <div className={`${styles.windowPopup} ${isVisible ? styles.active : ''}`}>
        <div className={styles.contentPopup}>

            <div className={styles.progressBar}>
                <div style={{
                    height: "100%",
                    width: `${filled}%`,
                    backgroundColor: "white",
                    transition: "width: 0.3s linear 0.3s"
                }}></div>
            </div>

            <Content
              isVisible={isVisible}
              indexStory={indexStory}
              stories={stories}
              closePopup={closePopup}
            />

        </div>
      </div>
    </Portal>
  )
});

interface IPopupStoriesContentProps {
  isVisible: boolean;
  indexStory?: number;
  stories: IStory[];
  closePopup: () => void;
}

const Content: FC<IPopupStoriesContentProps> = memo(({
  isVisible,
  indexStory, 
  stories,
  closePopup
 }) => {
  
  if (!isVisible) return null;

  return (
    <>
      {stories &&
      <div className={styles.headerStory}>
        <div className={styles.curUser}>
          <img
            className={styles.avatar}
            src={stories[indexStory! - 1].profilePic 
              ? urlAPIimages + stories[indexStory! - 1].profilePic 
              : noAvatar
            }
            alt={`avatar of ${stories[indexStory! - 1].username}`}
          />
          <span>{stories[indexStory! - 1].username}</span>
        </div>
        <CloseOutlinedIcon onClick={closePopup} className={styles.closeBtn} />
      </div>}
      {stories &&
      <div className={styles.contentStory}>
        <img
          className={styles.storyContent}
          src={urlAPIimages + stories[indexStory! - 1].image}
          alt={`Story ${indexStory! - 1} of ${
            stories[indexStory! - 1].username
          }`}
        />
      </div>}
    </>
  );
});

export default PopupStories;
