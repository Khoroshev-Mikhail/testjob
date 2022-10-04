import css from './RoundSlider.module.scss'
import gsap from 'gsap';
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
    /**
     * Функция для вращения #round на позицию где точка по которой был клик - будет на первой позиции. 
     * Функция вращает #round в лево или право по наименьшему пути
     * @param i - индекс точки на окружности по которой был клик.
     */
    function rotating(i: number){
        dispatch(setIndex(i))
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
        const angle = left >= right ? `+=${count * right}` : `-=${count * left}`
        gsap.to('#round', {rotation: angle})
    }
    return (
        <div className={css.roundContainer}>
            <div className={css.roundContainer__header}>Исторические<br/> даты</div>

            <div className={css.roundContainer__buttons}>
                <div>0{index + 1}/0{data.length}</div>
                <button className={`${css.circle}`} onClick={prevFn}>{`<`}</button>
                <button className={`${css.circle}`} onClick={nextFn}>{`>`}</button>
            </div>

            <div className={`${css.leftDate} ${css.date}`}>{data[index].start}</div>
            <div className={`${css.rightDate} ${css.date}`}>{data[index].end}</div>
            <div className={css.miniHeader}>{data[index].miniHeader}</div>
            
            <div className={`${css.roundContainer__round} ${css.circle} `} id="round">
                {data.map((el, i, arr) => {
                    return (
                        <div>
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
                                {i + 1}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={css.roundContainer__borderHorizont}></div>
            <div className={css.roundContainer__borderVertical} style={{height: document.documentElement.offsetHeight /* Добавить скролл динамически */}}></div>
        </div>
    )
}