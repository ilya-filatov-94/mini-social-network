import {ReactNode, ReactElement, HTMLAttributes} from 'react';
import styles from './ButtonLink.module.scss';
import { Link } from "react-router-dom";


interface ISpreadingButtonLinkProps
  extends HTMLAttributes<HTMLButtonElement> {
  addClass?: string;
  to: string;
  children: ReactNode
}


const ButtonLink = ({addClass, to, children, ...props}: ISpreadingButtonLinkProps): ReactElement => {
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
}

export default ButtonLink
