import { Middleware } from 'redux'
import { RootState } from './store'
export const myMW: Middleware<{}> = (store) => (next) => (action) => {
    const prevIndex = store.getState().index
    const result = next(action)
    if(action.type === 'index/setIndex' || action.type === 'index/prev' || action.type === 'index/next' ){
        const currentIndex = store.getState().index
        //Сюда можно вынести функции по вращению #round
        console.log(prevIndex, currentIndex)
    }
    return result
}