import {
  FC,
  memo,
  HTMLAttributes,
  ReactNode
} from 'react';
import styles from './ButtonLink.module.scss';
import { Link } from "react-router-dom";

interface ISpreadingButtonLinkProps
  extends HTMLAttributes<HTMLButtonElement> {
  addClass?: string;
  to: string;
  children: ReactNode
}

const ButtonLink: FC<ISpreadingButtonLinkProps> = memo(({
  addClass, 
  to, 
  children, 
  ...props
}) => {
  return (
    <Link to={to}>
        <button 
            {...props}
            className={addClass ? `${styles.Button} ${addClass}`: styles.Button}
            type="button">
            {children}
        </button>
    </Link>
  )
});

export default ButtonLink
