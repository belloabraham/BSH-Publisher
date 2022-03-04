import { inject, InjectionToken } from "@angular/core";
import { IDatabase } from "./idatabase";

export const DATABASE_IJTOKEN = new InjectionToken<IDatabase>('database');
