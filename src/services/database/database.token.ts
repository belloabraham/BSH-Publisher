import { inject, InjectionToken } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { Providers } from "src/data/providers";
import { FirestoreService } from "./firebase/firestore.service";
import { IDatabase } from "./idatabase";

export const DATABASE = new InjectionToken<IDatabase>('database', {
  providedIn: Providers.root,
  factory: () => new FirestoreService(inject(Firestore)),
});
