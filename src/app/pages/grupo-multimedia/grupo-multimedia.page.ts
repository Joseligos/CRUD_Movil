import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoMultimediaListComponent } from '../../components/grupo-multimedia-list/grupo-multimedia-list.component';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFab } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-grupo-multimedia',
  templateUrl: './grupo-multimedia.page.html',
  styleUrls: ['./grupo-multimedia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    GrupoMultimediaListComponent,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonFab
  ]
})
export class GrupoMultimediaPage implements OnInit {

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
  }

}