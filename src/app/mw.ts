export const myMW = (store: any) => (next: any) => (action: any) => {
    const prevIndex = store.getState().index
    const result = next(action)
    if(action.type === 'index/setIndex' || action.type === 'index/prev' || action.type === 'index/next' ){
        const currentIndex = store.getState().index
        console.log(prevIndex, currentIndex)
    }
    return result
}