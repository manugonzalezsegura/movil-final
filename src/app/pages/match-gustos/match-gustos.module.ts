import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchGustosPageRoutingModule } from './match-gustos-routing.module';

import { MatchGustosPage } from './match-gustos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchGustosPageRoutingModule
  ],
  declarations: [MatchGustosPage]
})
export class MatchGustosPageModule {}
