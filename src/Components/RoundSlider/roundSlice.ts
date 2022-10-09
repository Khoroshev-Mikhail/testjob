import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchData } from '../../app/dataAPI';
import { RootState } from '../../app/store';

export type SliderType = {
    header: string,
    description: string,
}
export type Data = {
    start: number,
    end: number,
    miniHeader: string,
    slider: SliderType[],
}
const initialState: Data[] = [
    {start: 1992, end: 1999, miniHeader: 'Наука1', slider: [
        {header: '1992', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1993', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1994', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1995', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1996', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1997', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1998', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
        {header: '1999', description: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'},
    ]}
]
export const getAsyncData = createAsyncThunk(
    'data/getAsyncData',
    async () => {
        const response = await fetchData();
        return response
    }
);

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(getAsyncData.fulfilled, (_, action: PayloadAction<Data[]>) => {
            return action.payload
        })
    }
})
export const getData = (state: RootState) => state.data
export const getMinAngle = (state: RootState) => 360 / state.data.length

export const indexSlice = createSlice({ 
    name: 'index',
    initialState: 0,
    reducers: {
        prev: (state, action: PayloadAction<number>) => {
            if(state === 0){
                return action.payload - 1 //Желательно получить data.length внутри reducer, а не через payload
            }
            return state - 1
        },
        next: (state, action: PayloadAction<number>) => {
            if(state === action.payload - 1){
                return 0
            }
            return state + 1
        },
        setIndex: (_, action: PayloadAction<number>) => {
            return action.payload
        }
    },
})
export const { prev, next, setIndex } = indexSlice.actions
export const getCurrentIndex = (state: RootState) => state.index