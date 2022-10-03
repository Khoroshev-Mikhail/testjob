import css from './RoundSlider.module.scss'
import gsap from 'gsap';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getCurrentIndex, getData, next, prev, setIndex } from './roundSlice';

export default function RoundSlider(){
    const data = useAppSelector(getData)
    const index = useAppSelector(getCurrentIndex)
    const dispatch = useAppDispatch()
    function nextFn(){
        dispatch(next(data.length))
        gsap.to('#round', {rotation: `-=${360 / data.length}`})
    }
    function prevFn(){
        dispatch(prev(data.length))
        gsap.to('#round', {rotation: `+=${360 / data.length}`})
    }
    function rotating(i: number){
        dispatch(setIndex(i))
    }
    return (
        <div className={css.roundContainer}>
            <div className={css.roundContainer__header}>Исторические<br/> даты</div>
            <div className={css.roundContainer__buttons}>
                <div>{index}/{data.length - 1}</div>
                <button className={`${css.circle}`} onClick={prevFn}>{`<`}</button>
                <button className={`${css.circle}`} onClick={nextFn}>{`>`}</button>
            </div>
            <div className={`${css.leftDate} ${css.date}`}>2015</div>
            <div className={`${css.rightDate} ${css.date}`}>2022</div>
            <div className={`${css.roundContainer__round} ${css.circle}`} id="round">
                <div className={css.cell}></div>
               
                {data.map((el, i, arr) => {
                    return (
                        <div>
                            <div onClick={()=>rotating(i)} className={`${css.circle} ${css.activePoints}`} style={{rotate: `${i * 360 / arr.length + 360 / arr.length / 2}deg`}}>{i}</div>
                        </div>
                    )
                })}
            </div>
            <div className={css.roundContainer__borderHorizont}></div>
            <div className={css.roundContainer__borderVertical} style={{height: document.querySelector('.App')?.clientHeight}}></div>
        </div>
    )
}