import {
  FC, 
  useEffect, 
  useState, 
  useRef,
  memo,
  useCallback,
} from 'react';
import styles from './PopupStories.module.scss';
import Portal from '../../../hoc/Portal';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {IStory} from '../../../types/story';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import {getRelativeTimeString} from '../../../helpers/dateTimeFormatting';

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

  const [filled, setFilled] = useState<number>(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const pause = useRef<boolean>(false);

  useEffect(() => {
    const frameSize = 30;  //чем меньше, тем плавнее прогресс-бар
    const step = 1;
    if (isVisible) {
      if (filled < 100) {
        if (!pause?.current) {
          timeout.current = setTimeout(() => setFilled((prev) => prev + step), frameSize);
        }
      }
      if (indexStory && indexStory > stories.length) {
        closePopup();
      }
      if (indexStory && filled >= 100 && stories.length === indexStory) {
        closePopup();
      }
      if (indexStory && filled >= 100 && stories.length > indexStory) {
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

  function pauseStartStory() {
    pause.current = true;
    clearTimeout(timeout.current)
  }

  function pauseStopStory() {
    pause.current = false;
    const frameSize = 30;  //чем меньше, тем плавнее прогресс-бар
    const step = 1;
    timeout.current = setTimeout(() => setFilled((prev) => prev + step), frameSize);
  }

  function prevStory() {
    if (indexStory && indexStory > 1) {
      setCurrentIndex(indexStory - 1);
      setFilled(0);
    }
  }

  function nextStory() {
    if (indexStory && stories.length > indexStory) {
      setCurrentIndex(indexStory + 1);
      setFilled(0);
    }
  }

  if (!isVisible) return null;

  return (
    <Portal>
      <div className={`${styles.windowPopup} ${isVisible ? styles.active : ''}`}>
        <div className={styles.contentPopup}>

            <div className={styles.progressBar}>
                <div style={{
                    height: "100%",
                    backgroundColor: "white",
                    transformOrigin: "0% 100%",
                    transform: `scaleX(${filled/100})`
                }}/>
            </div>

            <Content
              isVisible={isVisible}
              indexStory={indexStory}
              stories={stories}
              prevStory={prevStory}
              nextStory={nextStory}
              pauseStartStory={pauseStartStory}
              pauseStopStory={pauseStopStory}
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
  nextStory: () => void;
  prevStory: () => void;
  pauseStartStory: () => void;
  pauseStopStory: () => void;
  closePopup: () => void;
}

const Content: FC<IPopupStoriesContentProps> = memo(({
  isVisible,
  indexStory, 
  stories,
  nextStory,
  prevStory,
  pauseStartStory,
  pauseStopStory,
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
          <p>{stories[indexStory! - 1].username}</p>
          <p className={styles.date}>
            {getRelativeTimeString(Date.parse(stories[indexStory! - 1].date!), 'ru')}
          </p>
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
        <div className={styles.clickArea}>
          <div className={styles.leftArea} onPointerDown={prevStory}/>
          <div className={styles.centerArea} onPointerDown={pauseStartStory} onPointerUp={pauseStopStory}/>
          <div className={styles.rightArea} onPointerDown={nextStory}/>
        </div>
      </div>}
    </>
  );
});

export default PopupStories;
