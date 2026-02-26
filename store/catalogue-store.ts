
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
	id: string;
	name: string;
	description?: string;
	subcategories?: { id: string; name: string }[];
}

export interface Store {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	imageUrl?: string;
	[key: string]: any;
}

export interface Brand {
	id: string;
	name: string;
	[key: string]: any;
}

interface CatalogueState {
	categories: Category[];
	stores: Store[];
	brands: Brand[];
}

const initialState: CatalogueState = {
	categories: [],
	stores: [],
	brands: [],
};

const catalogueSlice = createSlice({
	name: "catalogue",
	initialState,
	reducers: {
		setCategories(state, action: PayloadAction<Category[]>) {
			state.categories = action.payload;
		},
		setStores(state, action: PayloadAction<Store[]>) {
			state.stores = action.payload;
		},
		setBrands(state, action: PayloadAction<Brand[]>) {
			state.brands = action.payload;
		},
		resetCatalogue(state) {
			state.categories = [];
			state.stores = [];
			state.brands = [];
		},
	},
});

export const { setCategories, setStores, setBrands, resetCatalogue } = catalogueSlice.actions;
export default catalogueSlice.reducer;
