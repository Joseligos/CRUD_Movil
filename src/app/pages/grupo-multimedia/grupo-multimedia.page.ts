import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoMultimediaListComponent } from '../../components/grupo-multimedia-list/grupo-multimedia-list.component';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-grupo-multimedia',
  templateUrl: './grupo-multimedia.page.html',
  styleUrls: ['./grupo-multimedia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    GrupoMultimediaListComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class GrupoMultimediaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}