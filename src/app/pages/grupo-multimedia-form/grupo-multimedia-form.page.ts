import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoMultimediaEditComponent } from '../../components/grupo-multimedia-edit/grupo-multimedia-edit.component';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-grupo-multimedia-form',
  templateUrl: './grupo-multimedia-form.page.html',
  styleUrls: ['./grupo-multimedia-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    GrupoMultimediaEditComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonText
  ]
})
export class GrupoMultimediaFormPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}