import React from 'react'
import styles from './Home.module.css';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';
import {  useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
    function startRegister(){
        navigate('/authenticate');
        
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Sympathy!" icon="logo">
                <p className={styles.text}>
                Tap into the world's largest network of licensed, accredited, and experienced therapy sessions which can help you with a range of issues including depression, anxiety, relationships, trauma, grief, and more. 
                </p>
                <div>
                <Button onClick={startRegister} text="Let's Go" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>
                        Have an invite text?
                    </span>
                    
                </div>
            </Card>
        </div>
    )
}

export default Home