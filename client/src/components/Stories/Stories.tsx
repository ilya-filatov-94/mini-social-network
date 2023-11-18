import {
  FC, 
  useRef, 
  useState,
  useEffect,
  useCallback,
  PointerEvent,
  MouseEvent,
} from 'react';
import styles from './Stories.module.scss';
import StoryTemplate from './StoryTemplate/StoryTemplate';
import PopupStories from './PopupStories/PopupStories';
import {useAppSelector} from '../../hooks/useTypedRedux';
import {getRefValue, useStateRef} from '../../hooks/useStateRef';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {useGetAllStoriesQuery} from '../../services/StoryService';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Loader from '../Loader/Loader';
import Alert from '@mui/material/Alert';
import {IStory} from '../../types/story';
import {urlAPIimages} from '../../env_variables';


export type TEventTouch = MouseEvent | PointerEvent;
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
  const itemRef = useRef<HTMLDivElement>(null);
  const minOffsetXRef = useRef(0);
  const {isMobile} = useMatchMedia();

  const {
    data: stories, 
    error, 
    isLoading
  } = useGetAllStoriesQuery(currentUser.id);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  useEffect(() => {  
    if (stories?.length) {
      const hasStory = stories[0].userId === currentUser.id 
      && stories[0].image !== '';
      if (hasStory) {
        setStoryCurrentUser(urlAPIimages + stories[0].image as string);
      }
    }
  }, [stories, currentUser.id]);

  const handlerDragStart = (event: MouseEvent<HTMLDivElement>) => {
    isDragStart.current = true;
    const containerEl = getRefValue(containerRef);
    const itemEl = getRefValue(itemRef);
    if (stories?.length && isMobile) {
      minOffsetXRef.current = ((itemEl.offsetWidth+3) * stories?.length) - (containerEl.scrollWidth);
    }
    if (stories?.length && !isMobile) {
      minOffsetXRef.current = ((itemEl.offsetWidth-10) * stories?.length) - (containerEl.scrollWidth);
    }
    // minOffsetXRef.current = containerEl.offsetWidth - (containerEl.scrollWidth);
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
    if (newOffsetX < minOffsetX*0.3) {
      newOffsetX = minOffsetX;
    }
    setOffsetX(newOffsetX);
  };

  const setCurrentIndex = useCallback((index?: number) => {
    setIndexStory(index);
    clickIndex.current = index;
  }, []);

  const openStory = useCallback((event: TEventTouch) => {  
    if (stories?.length) {
      const currentX = event.clientX;
      const diff = getRefValue(startXRef) - currentX;
      let notOpen = true;
      if (!Boolean(hasStoryCurUser)) {
        notOpen = clickIndex.current === 0 
        && !Boolean(hasStoryCurUser);
      }
      if (Boolean(hasStoryCurUser)) {
        notOpen = clickIndex.current === 1 
        && !Boolean(hasStoryCurUser);
      }
      if (Math.abs(diff) < 1 && !notOpen) {
        setOpenStories(true);
      }
    }
  }, [stories, hasStoryCurUser]);

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
    }
  }

  return (
    <>
    <div
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
          curIndex={hasStoryCurUser ? 1 : 0}
          setIndexStory={setCurrentIndex}
          setStoryCurrentUser={setStoryCurrentUser}
          openStory={openStory}
          refElem={itemRef}
        />
        {(stories && stories?.length !== 0) &&
        stories.map((story: IStory, index: number) => {
          if (story.userId === currentUser.id) return null;
          return (
          <StoryTemplate
            key={story.id}
            image={urlAPIimages + story.image as string}
            username={story.username}
            curIndex={index+1}
            setIndexStory={setCurrentIndex}
            openStory={openStory}
          />
        )})}
      </div>
    </div>
    {stories &&
    <PopupStories 
      isVisible={isOpenStories}
      setVisible={setOpenStories}
      indexStory={indexCurrentStory}
      setCurrentIndex={setCurrentIndex}
      stories={stories}
    />}
    </>
  );
}

export default Stories;
