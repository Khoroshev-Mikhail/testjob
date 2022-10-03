import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useAppSelector } from '../../app/hooks';

import css from './sliderS.module.scss'
import { useId } from 'react';
import { getCurrentIndex, getData } from '../RoundSlider/roundSlice';

export default function SliderS(){
    const id = useId()
    const data = useAppSelector(getData)
    const index = useAppSelector(getCurrentIndex)
    return(
        <div className={css.sliderContainer}>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={40}
                slidesPerView={3}
                navigation={true}
                //onSwiper={(swiper) => console.log(swiper)}
                //onSlideChange={() => console.log('slide change')}
                >
                {data[index].slider.map((slide, i) => {
                    return (
                        <SwiperSlide className={css.slide} key={id+i}>
                            <div className={css.header}>{slide.header}</div>
                            <div className={css.description}>{slide.description}</div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}