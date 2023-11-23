import {FC} from 'react';
import styles from './RightBar.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import CardOfSuggestionFriend from '../CardOfSuggestionFriend/CardOfSuggestionFriend';
import CardOfActivitiesFriend from '../CardOfActivitiesFriend/CardOfActivitiesFriend';


import {
  activitiesOfFriends,
} from './arraysOfActivities';


const RightBar: FC = () => {

  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.rightBar} ${styles['theme-dark']}`
      : `${styles.rightBar} ${styles['theme-light']}`
    }>
      <div className={styles.container}>

        <div className={`${styles.item} ${styles.suggestions}`}>
          <span className={styles.headerItem}>Предложения для Вас</span>
          <CardOfSuggestionFriend idCurUser={currentUser.id}/>
        </div>

        <div className={styles.item}>
          <span className={styles.headerItem}>Последняя активность</span>
          {activitiesOfFriends.map(item => 
            <CardOfActivitiesFriend 
              key={item.id}
              name={item.username}
              refUser={item.refUser}
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
