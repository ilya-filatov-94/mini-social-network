import {
  FC, 
  useRef, 
  useState,
  PointerEvent,
  MouseEvent,
} from 'react';
import styles from './Stories.module.scss';
import StoryTemplate from './StoryTemplate/StoryTemplate';
import PopupStories from './PopupStories/PopupStories';
import {useAppSelector} from '../../hooks/useTypedRedux';

import {stories} from './temporaryData';


type TEventTouch = MouseEvent | PointerEvent;

const Stories: FC = () => {
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
   // eslint-disable-next-line
  const [hasStoryCurUser, setStoryCurrentUser] = useState(undefined);
  const [isOpenStories, setOpenStories] = useState<boolean>(false);

  const refCarousel = useRef<any>(null);
  const isDragStart = useRef<boolean>(false);
  const prevPageX = useRef<number>(0);
  const prevScrollLeft = useRef<any>(null);
  const [indexCurrentStory, setIndexStory] = useState<number | undefined>(0);
  const clickIndex = useRef<number | undefined>(0);

  function handlerDragStart(event: TEventTouch): void {
    isDragStart.current = true;
    prevPageX.current = event.pageX;
    prevScrollLeft.current = refCarousel.current?.scrollLeft;
  }

  function handlerDragging(event: TEventTouch): void {
    if (!isDragStart.current) return;
    event.preventDefault();
    let positionDiff = event.pageX - prevPageX.current;
    refCarousel.current.scrollLeft = prevScrollLeft.current - positionDiff;
  }

  function handlerDragStop(event: TEventTouch): void {
    event.preventDefault();
    isDragStart.current = false;
  }

  function setCurrentIndex(index?: number): void {
    setIndexStory(index);
    clickIndex.current = index;
  }

  function openStory(event: TEventTouch) {
    let positionDiff = event.pageX - prevPageX.current;
    const notOpen = clickIndex.current === 0 && !hasStoryCurUser;
    if (Math.abs(positionDiff) < 1 && !notOpen) {
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
      ref={refCarousel}
    >
      <div className={styles.stories}>
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
