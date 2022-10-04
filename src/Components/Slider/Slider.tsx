import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useAppSelector } from '../../app/hooks';

import css from './slider.module.scss'
import { useEffect, useId, useState } from 'react';
import { getCurrentIndex, getData, SliderType } from '../RoundSlider/roundSlice';

export default function Slider(){
    const id = useId()
    const data = useAppSelector(getData)
    const index = useAppSelector(getCurrentIndex)
    const [slidersPerView, setSlidersPerView] = useState<number>(3)
    const [clientWidth, setClientWidth] = useState<number>(document.documentElement.clientWidth)
    const [height, setHeight] = useState<string>('auto')

    function resize(){
        setClientWidth(document.documentElement.clientWidth)
    }
    useEffect(()=>{
        if(clientWidth < 580){
            setSlidersPerView(2)
            setHeight(document.documentElement.clientHeight - 460 + 'px')
        }
        if(clientWidth >= 580){
            setSlidersPerView(3)
            setHeight('auto')
        }
    }, [clientWidth])
    useEffect(()=>{
        window.addEventListener('resize', resize)
        return () =>{
            window.removeEventListener('resize', resize)
        }
    }, [])
    return(
        <div className={css.sliderContainer}>
            <style>
                {`
                .swiper-button-disabled{
                    display: none;
                }
                `}
            </style>            
            <div className={css.swiperNav}>
                <div className={`${css.circle} ${css.left}`}>{`<`}</div>
                <div className={`${css.circle} ${css.right}`}>{`>`}</div>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={40}
                slidesPerView={slidersPerView}
                navigation={{nextEl: `.${css.right}`, prevEl: `.${css.left}`}}
                pagination={clientWidth <= 580}
            >
                {data[index].slider.map((slide: SliderType, i) => {
                    return (
                        <SwiperSlide className={css.slide} key={id+i}>
                            <div className={css.header}>{slide.header}</div>
                            <div className={css.description} style={{height}}>{slide.description}</div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}