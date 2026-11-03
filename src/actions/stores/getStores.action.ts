import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import storesData from "../../data/stores/stores.data.json";

export interface StorePlace {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  phone?: string;
  hours?: string;
}

export interface GetStoresResult {
  message: string;
  data: StorePlace[];
  searchedZip?: string;
}

export const getStores = defineAction({
  input: z
    .object({
      zipCode: z.string().optional(),
    })
    .optional(),
  handler: async (input): Promise<GetStoresResult> => {
    const places = (storesData.places || []) as StorePlace[];
    const zip = input?.zipCode?.trim();

    if (!zip) {
      return {
        message: "Todas las sucursales obtenidas",
        data: places,
      };
    }

    const filtered = places.filter(
      (p) =>
        p.zipCode.includes(zip) ||
        p.address.toLowerCase().includes(zip.toLowerCase()) ||
        p.name.toLowerCase().includes(zip.toLowerCase()),
    );

    return {
      message:
        filtered.length > 0
          ? `Se encontraron ${filtered.length} sucursal(es) para el código ZIP ${zip}`
          : `No se encontraron sucursales para el código ZIP ${zip}`,
      data: filtered.length > 0 ? filtered : places,
      searchedZip: zip,
    };
  },
});
