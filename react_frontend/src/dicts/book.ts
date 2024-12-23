import { BookState } from "redux/types/book";

export const BOOK_STATE_NAMES: {[key in BookState]: string} = {
    "0": "Новая",
    "1": "Хорошая",
    "2": "Поношеная",
    "3": "В ремонте",
    "4": "Списана",
    "5": "Утеряна",
}