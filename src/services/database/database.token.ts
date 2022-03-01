import { inject, InjectionToken } from "@angular/core";
import { IDatabase } from "./idatabase";

export const DATABASE = new InjectionToken<IDatabase>('database');
