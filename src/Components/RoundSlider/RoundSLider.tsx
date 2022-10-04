import css from './RoundSlider.module.scss'
import gsap from 'gsap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getCurrentIndex, getData, next, prev, setIndex } from './roundSlice';
import { useEffect, useId, useState } from 'react';

export default function RoundSlider(){
    const dispatch = useAppDispatch()
    const id = useId()
    const data = useAppSelector(getData)
    const index = useAppSelector(getCurrentIndex)
    const [start, setStart] = useState(data[index].start)
    const [end, setEnd] = useState(data[index].end)
    console.log()

    function nextFn(){
        dispatch(next(data.length))
        gsap.to('#round', {rotation: `-=${360 / data.length}`})
        gsap.to('.rotateText', {rotation:`+=${360 / data.length}`})
    }
    function prevFn(){
        dispatch(prev(data.length))
        gsap.to('#round', {rotation: `+=${360 / data.length}`})
        gsap.to('.rotateText', {rotation:`-=${360 / data.length}`})
    }
    /**
     * Функция для вращения #round на позицию где точка по которой был клик - будет на первой позиции. 
     * Функция вращает #round в лево или право по наименьшему пути
     * @param i - индекс точки на окружности по которой был клик.
     */
    function rotating(i: number){
        dispatch(setIndex(i))
        gsap.to('#round', {rotation: getAngle(i)})
        gsap.to('.rotateText', {rotation: reverseRotate(getAngle(i))})
    }
    /**
     * 
     * @param i 
     * @returns возвращает строку в формате "+=Х", где Х угол на который должен вращаться #round 
     */
    function getAngle(i: number){
        const count = 360 / data.length
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
        return left >= right ? `+=${count * right}` : `-=${count * left}`
    }
    /**
     * 
     * @param str строка "+=X" или "-=Х" которую возвращает функция getAngle
     * @returns возвращает ту же строку только меняет + на - и наоборот
     */
    function reverseRotate(str: string){
        return str[0] === '+' ? ('-' + str.slice(1)) : ('+' + str.slice(1)) 
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
    useEffect(()=>{
        dateAnimate(start, data[index].start, 333 / Math.abs(start - data[index].start))
        dateAnimate(end, data[index].end, 333 / Math.abs(end - data[index].end), false)
        gsap.fromTo('#miniHeader', {opacity: 0}, {opacity: 1, duration: 2})   
    }, [index])

    return (
        <div className={css.roundContainer}>
            <div className={css.roundContainer__header}>Исторические<br/> даты</div>

            <div className={css.roundContainer__buttons}>
                <div>0{index + 1}/0{data.length}</div>
                <button className={`${css.circle}`} onClick={prevFn}>{`<`}</button>
                <button className={`${css.circle}`} onClick={nextFn}>{`>`}</button>
            </div>

            <div className={`${css.leftDate} ${css.date}`}>{start}</div>
            <div className={`${css.rightDate} ${css.date}`}>{end}</div>
            <div id="miniHeader" className={css.miniHeader}>{data[index].miniHeader}</div>
            
            <div className={`${css.roundContainer__round} ${css.circle} `} id="round">
                {data.map((el, i, arr) => {
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
                                style={{rotate: `${i * 360 / arr.length + 360 / arr.length / 2}deg`}}
                            >
                                <div className='rotateText' style={{rotate: `-${i * 360 / arr.length + 360 / arr.length / 2}deg`}}>{i + 1}</div>
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