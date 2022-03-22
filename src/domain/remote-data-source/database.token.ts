import { inject, InjectionToken } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { Providers } from "../data/providers";
import { FirestoreService } from "./firebase/firestore.service";
import { IDatabase } from "./idatabase";

export const DATABASE_IJTOKEN = new InjectionToken<IDatabase>('database', {
  providedIn: Providers.root,
  factory: () =>
    new FirestoreService(
      inject(Firestore)
    ),
});
