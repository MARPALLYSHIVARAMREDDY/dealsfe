import { getCategories, getBrands, getStores } from '@/data/catalogues/catalogues-server-only'
import CatelogueInitializer from './catelogue-initializer'

export default async function AuthRoute() {
  try {
    // Fetch all catalogue data in parallel for better performance
    const [countries, brands, stores] = await Promise.all([
      getCategories(),
      getBrands(),
      getStores(),
    ]);

    return (
      <div>
        <CatelogueInitializer countries={countries} brands={brands} stores={stores} />
      </div>
    );
  } catch (error) {
    console.error('Failed to load catalogue data:', error);
    // Graceful degradation - return empty arrays so app remains functional
    return (
      <div>
        <CatelogueInitializer countries={[]} brands={[]} stores={[]} />
      </div>
    );
  }
}




