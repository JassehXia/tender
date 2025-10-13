import styles from '../styles/MainPage.css';
import Card from './Card';
import { useState } from 'react';

export default function CardBox(){
    const [isEmpty, setIsEmpty] = useState(false);
    return(
        <div className="cardBox">
            <fragment>
                <Card />
            </fragment>
        </div>
  );
}