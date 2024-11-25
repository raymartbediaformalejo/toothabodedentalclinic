import { z } from "zod";
import { createPatientSchema, loginUserSchema } from "./schema";

export type TCreatePatient = z.infer<typeof createPatientSchema>;

export type TLoginUser = z.infer<typeof loginUserSchema>;

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

export type TUsername = {
  firstname: string;
  lastname: string;
  middlename?: string;
};
