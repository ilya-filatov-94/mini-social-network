import {
  FC,  
  useEffect, 
  useState, 
  ReactElement 
} from 'react'
import ReactDOM from 'react-dom';


interface IProps {
  children: ReactElement | null;
}

const Portal: FC<IProps> = ({children}: IProps) => {
  const [container] = useState<HTMLDivElement>(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
        document.body.removeChild(container);
    }
  //eslint-disable-next-line
  }, []);

  return ReactDOM.createPortal(children, container);
}

export default Portal
