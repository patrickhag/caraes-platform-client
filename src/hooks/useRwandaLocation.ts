import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import locationsData from "../lib/locationsInRwanda.json";

// The JSON shape is:
// { [province]: { [district]: { [sector]: { [cell]: string[] } } } }
type LocationData = Record<string, Record<string, Record<string, Record<string, string[]>>>>;

const data = locationsData as LocationData;

export function useRwandaLocation(form: UseFormReturn<any>) {
  const province = form.watch("province");
  const district = form.watch("district");
  const sector = form.watch("sector");
  const cell = form.watch("cell");

  const provinces = useMemo(() => Object.keys(data).sort(), []);

  const districts = useMemo(() => {
    if (!province || !data[province]) return [];
    return Object.keys(data[province]).sort();
  }, [province]);

  const sectors = useMemo(() => {
    if (!province || !district || !data[province]?.[district]) return [];
    return Object.keys(data[province][district]).sort();
  }, [province, district]);

  const cells = useMemo(() => {
    if (!province || !district || !sector || !data[province]?.[district]?.[sector]) return [];
    return Object.keys(data[province][district][sector]).sort();
  }, [province, district, sector]);

  const villages = useMemo(() => {
    if (!province || !district || !sector || !cell || !data[province]?.[district]?.[sector]?.[cell]) return [];
    return [...data[province][district][sector][cell]].sort();
  }, [province, district, sector, cell]);

  /** Call when province changes — clears everything downstream */
  const onProvinceChange = (value: string) => {
    form.setValue("province", value);
    form.setValue("district", "");
    form.setValue("sector", "");
    form.setValue("cell", "");
    form.setValue("village", "");
  };

  /** Call when district changes — clears sector, cell, village */
  const onDistrictChange = (value: string) => {
    form.setValue("district", value);
    form.setValue("sector", "");
    form.setValue("cell", "");
    form.setValue("village", "");
  };

  /** Call when sector changes — clears cell, village */
  const onSectorChange = (value: string) => {
    form.setValue("sector", value);
    form.setValue("cell", "");
    form.setValue("village", "");
  };

  /** Call when cell changes — clears village */
  const onCellChange = (value: string) => {
    form.setValue("cell", value);
    form.setValue("village", "");
  };

  return {
    provinces,
    districts,
    sectors,
    cells,
    villages,
    onProvinceChange,
    onDistrictChange,
    onSectorChange,
    onCellChange,
  };
}
