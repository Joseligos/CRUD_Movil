import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultimediaListComponent } from '../../components/multimedia-list/multimedia-list.component';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFab } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.page.html',
  styleUrls: ['./multimedia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MultimediaListComponent,
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
export class MultimediaPage implements OnInit {

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
  }

}
