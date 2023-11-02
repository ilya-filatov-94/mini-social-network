import {
  FC, 
  useRef, 
  useState,
  useCallback,
  PointerEvent,
  MouseEvent,
} from 'react';
import styles from './Stories.module.scss';
import StoryTemplate from './StoryTemplate/StoryTemplate';
import PopupStories from './PopupStories/PopupStories';
import {useAppSelector} from '../../hooks/useTypedRedux';
import {getRefValue, useStateRef} from '../../hooks/useStateRef';

import {stories} from './temporaryData';


type TEventTouch = MouseEvent | PointerEvent;

const Stories: FC = () => {
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
   // eslint-disable-next-line
  const [hasStoryCurUser, setStoryCurrentUser] = useState(undefined);
  const [isOpenStories, setOpenStories] = useState<boolean>(false);
  const clickIndex = useRef<number | undefined>(0);
  const [indexCurrentStory, setIndexStory] = useState<number | undefined>(0);

  const isDragStart = useRef<boolean>(false);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const minOffsetXRef = useRef(0);

  const handlerDragStart = (event: MouseEvent<HTMLDivElement>) => {
    isDragStart.current = true;
    const containerEl = getRefValue(containerRef);
    minOffsetXRef.current = containerEl.offsetWidth - (containerEl.scrollWidth)*0.77;
    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = event.clientX;
  };

  const handlerDragStop = (event: TEventTouch) => {
    event.preventDefault();
    isDragStart.current = false;
  }

  const handlerDragging = (event: TEventTouch) => {
    if (!isDragStart.current) return;
    const currentX = event.clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;
    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);
    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }
    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }
    setOffsetX(newOffsetX);
  };

  const setCurrentIndex = useCallback((index?: number) => {
    setIndexStory(index);
    clickIndex.current = index;
  }, []);

  function openStory(event: TEventTouch) {
    const currentX = event.clientX;
    const diff = getRefValue(startXRef) - currentX;
    const notOpen = clickIndex.current === 0 && !hasStoryCurUser;
    if (Math.abs(diff) < 1 && !notOpen) {
      setOpenStories(true);
      console.log(clickIndex.current);
    }
  }

  return (
    <>
    <div
      onClick={openStory}
      onPointerDown={handlerDragStart}
      onPointerMove={handlerDragging}
      onPointerUp={handlerDragStop}
      onPointerLeave={handlerDragStop}
      className={styles.container}
    >
      <div
        className={`${styles.stories} ${isDragStart.current ? styles['is-swiping'] : ''}`}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
        ref={containerRef}
      >
        <StoryTemplate 
          image={hasStoryCurUser} 
          username={currentUser.username}
          curIndex={0}
          setIndexStory={setCurrentIndex}
        />
        {stories.map((story) => (
          <StoryTemplate
            key={story.id}
            image={story.image}
            username={story.username}
            curIndex={story.id}
            setIndexStory={setCurrentIndex}
          />
        ))}
      </div>
    </div>
    <PopupStories 
      isVisible={isOpenStories}
      setVisible={setOpenStories}
      indexStory={indexCurrentStory}
      setCurrentIndex={setCurrentIndex}
      stories={stories}
    />
    </>
  );
}

export default Stories;
