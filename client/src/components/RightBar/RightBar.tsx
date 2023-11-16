import {FC} from 'react';
import styles from './RightBar.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';

import CardOfSuggestionFriend from '../CardOfSuggestionFriend/CardOfSuggestionFriend';
import CardOfActivitiesFriend from '../CardOfActivitiesFriend/CardOfActivitiesFriend';
import {
  possibleFriends,
  activitiesOfFriends,
} from './arraysOfActivities';


const RightBar: FC = () => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.rightBar} ${styles['theme-dark']}`
      : `${styles.rightBar} ${styles['theme-light']}`
    }>
      <div className={styles.container}>

        <div className={styles.item}>
          <span className={styles.headerItem}>Предложения для Вас</span>
          {possibleFriends.map(item => 
            <CardOfSuggestionFriend 
              key={item.id}
              name={item.name} 
              refUser={item.name}
              avatar={item.avatar}
            />
          )}
        </div>

        <div className={styles.item}>
          <span className={styles.headerItem}>Последняя активность</span>
          {activitiesOfFriends.map(item => 
            <CardOfActivitiesFriend 
              key={item.id}
              name={item.name}
              refUser={item.name}
              avatar={item.avatar}
              textEvent={item.textEvent}
              timeEvent={item.timeEvent}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default RightBar
