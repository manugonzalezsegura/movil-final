import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../componets/map/map.component';
import {ButtonBarComponent} from '../componets/button-bar/button-bar.component'
import { IonicModule } from '@ionic/angular'; 

@NgModule({
  declarations: [MapComponent,ButtonBarComponent],
  imports: [CommonModule,IonicModule ],
  exports: [MapComponent,ButtonBarComponent] 
})
export class SharedModule {}