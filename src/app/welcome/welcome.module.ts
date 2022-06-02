import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { getStorage, provideStorage } from '@angular/fire/storage';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
})
export class WelcomeModule {}
