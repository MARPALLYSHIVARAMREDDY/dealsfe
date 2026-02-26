"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setCategories, setBrands, setStores } from "@/store/catalogue-store"


interface CatelogueProviderProps {
	countries: any[];
	brands: any[];
	stores: any[];
}

export default function CatelogueProvider({ countries, brands, stores }: CatelogueProviderProps) {
	const dispatch = useAppDispatch();
	// console.log("CatelogueInitializer - Initializing catalogue data", { countries, brands, stores });

	useEffect(() => {
		if (countries) dispatch(setCategories(countries));
		if (brands) dispatch(setBrands(brands));
		if (stores) dispatch(setStores(stores));
	}, [countries, brands, stores, dispatch]);

	return null
}



