import css from './RoundSlider.module.scss'
import gsap from 'gsap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getCurrentIndex, getData, getMinAngle, next, prev, setIndex } from './roundSlice';
import { useEffect, useId, useState } from 'react';

export default function RoundSlider(){
    const dispatch = useAppDispatch()
    const id = useId()
    const data = useAppSelector(getData)
    const index = useAppSelector(getCurrentIndex)
    const minAngle = useAppSelector(getMinAngle)
    const [start, setStart] = useState(data[index].start)
    const [end, setEnd] = useState(data[index].end)

    function nextFn(){
        dispatch(next(data.length))
        gsap.to('#round', {rotation: `-=${minAngle}`})
        gsap.to('.rotateText', {rotation:`+=${minAngle}`})
    }
    function prevFn(){
        dispatch(prev(data.length))
        gsap.to('#round', {rotation: `+=${minAngle}`})
        gsap.to('.rotateText', {rotation:`-=${minAngle}`})
    }
    /**
     * Функция для вращения #round на позицию где точка по которой был клик - будет на первой позиции. 
     * Функция вращает #round в лево или право по наименьшему пути
     * @param i - индекс точки на окружности по которой был клик.
     */
    function rotating(i: number){
        dispatch(setIndex(i))
        gsap.to('#round', {rotation: `+=${getAngle(i)}`})
        gsap.to('.rotateText', {rotation: `-=${getAngle(i)}`})
    }
    /**
     * Функция возвращает угол на который должен вращаться #round чтобы точка по которой был клик была перемещена на первую позицию по наименьшему пути
     * @param i - индекс точки на окружности по которой был клик
     * @returns возвращает угол на который должен вращаться #round (значение может быть отрицательным)
     */
    function getAngle(i: number){
        let left = 0;
        let right = 0;
        if(i > index){
            left = i - index
            right = data.length - i + index
        }
        if(i < index){
            left = data.length - index + i
            right = index - i
        }
        return left >= right ? (minAngle * right) : (- minAngle * left)
    }
    /**
     * Рекурсивная функция для плавной смены цифр даты за 333ms
     * @param current - текущая цифра
     * @param finish - значение к которому стремится текущая дата, так же это значение - это базовый случай рекурсии (выход)
     * @param delay - задержка в ms = 333ms / (current - finish) при первом вызове
     * @param start - свитчер. Т.к. даты = 2, они хранятся в локальном стейте и при перезаписи используют разные функции. Если 
     * true (по умолчанию) значит записывает первую дату setStart, иначе setEnd
     * @returns 
     */
    function dateAnimate(current: number, finish: number, delay: number, start: boolean = true){
        if(current === finish) return current
        if(current < finish){
            start ? setStart(current + 1) : setEnd(current + 1)
            setTimeout(()=>{dateAnimate(current + 1, finish, delay, start)}, delay)
        }
        if(current > finish){
            start ? setStart(current - 1) : setEnd(current - 1)
            setTimeout(()=>{dateAnimate(current - 1, finish, delay, start)}, delay)
        }
    }
    //При каждой смене индекса - запускаются функции которые плавно меняют цифры у дат
    useEffect(()=>{
        dateAnimate(start, data[index].start, 333 / Math.abs(start - data[index].start))
        dateAnimate(end, data[index].end, 333 / Math.abs(end - data[index].end), false)
        gsap.fromTo(`.${css.roundContainer__miniHeader}`, {opacity: 0}, {opacity: 1, duration: 2})   
    }, [index])
    return (
        <div className={css.roundContainer}>
            <div className={css.roundContainer__header}>Исторические<br/> даты</div>

            <div className={css.roundContainer__buttons}>
                <div>0{index + 1}/0{data.length}</div>
                <button className={`${css.circle}`} onClick={prevFn}>{`<`}</button>
                <button className={`${css.circle}`} onClick={nextFn}>{`>`}</button>
            </div>

            <div className={`${css.roundContainer__leftDate} ${css.date}`}>{start}</div>
            <div className={`${css.roundContainer__rightDate} ${css.date}`}>{end}</div>
            <div className={css.roundContainer__miniHeader}>{data[index].miniHeader}</div>
            
            <div className={`${css.roundContainer__round} ${css.circle} `} id="round">
                {data.map((_, i) => {
                    return (
                        <div key={id + i}>
                            <div 
                                id={`point${i}`} 
                                onMouseOver={()=>{
                                    document.getElementById(`point${i}`)?.classList.add(css.activePoints)
                                    document.getElementById(`point${i}`)?.classList.remove(css.points)
                                }} 
                                onMouseLeave={()=>{
                                    if(i !== index){
                                        document.getElementById(`point${i}`)?.classList.add(css.points)
                                        document.getElementById(`point${i}`)?.classList.remove(css.activePoints)
                                    }
                                }}
                                onClick={()=>rotating(i)} 
                                className={`${css.circle} ${ i === index ? css.activePoints : css.points}`} 
                                style={{rotate: `${i * minAngle + minAngle / 2}deg`}}
                            >
                                <div className='rotateText' style={{rotate: `-${i * minAngle + minAngle / 2}deg`}}>{i + 1}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={css.roundContainer__borderHorizont}></div>
            <div className={css.roundContainer__borderVertical} style={{height: document.body.clientHeight /* Добавить скролл динамически */}}></div>
        </div>
    )
}