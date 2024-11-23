import { z } from "zod";
import { createPatientSchema } from "./schema";

export type TCreatePatient = z.infer<typeof createPatientSchema>;

export type TRegion = {
  code: string;
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
};

export type TProvince = TRegion & { region_id: number };

export type TBrgys = TProvince & {
  city_municipality_id: number;
  province_id: number;
  status: string;
};
export type TBrgysManila = {
  name: string;
};
