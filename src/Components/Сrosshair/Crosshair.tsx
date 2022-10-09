import css from './crosshair.module.scss'
/**
 * Компонента возвращает перекрестие из вертикального и горизонтального borders по верх свей страницы. (Центр перекрестия = центру окружности)
 */
export default function Crosshair(){
    return (
        <>
            <div className={css.borderHorizont}></div>
            <div className={css.borderVertical} style={{height: document.body.clientHeight}}></div>
        </>
    )
}