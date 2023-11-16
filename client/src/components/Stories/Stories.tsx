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
export type TPreviewImg = string | ArrayBuffer | null;

const Stories: FC = () => {
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
  const [hasStoryCurUser, setStoryCurrentUser] = useState<TPreviewImg>('');
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
    console.log(index);
    
    clickIndex.current = index;
  }, []);

  function openStory(event: TEventTouch) {
    const currentX = event.clientX;
    const diff = getRefValue(startXRef) - currentX;
    // const notOpen = clickIndex.current === 0 && !hasStoryCurUser;
    const notOpen = clickIndex.current === stories.length && !hasStoryCurUser;
    if (Math.abs(diff) < 1 && !notOpen) {
      setOpenStories(true);
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
          userId={currentUser.id}
          image={hasStoryCurUser} 
          username='Ваша история'
          curIndex={stories.length}
          setIndexStory={setCurrentIndex}
          setStoryCurrentUser={setStoryCurrentUser}
        />
        {stories.map((story, index) => {
          if (index === stories.length-1) return null;
          return (
          <StoryTemplate
            key={story.id}
            image={story.image as string}
            username={story.username}
            curIndex={index+1}
            setIndexStory={setCurrentIndex}
          />
        )})}
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
