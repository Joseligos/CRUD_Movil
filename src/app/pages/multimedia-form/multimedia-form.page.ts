import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultimediaEditComponent } from '../../components/multimedia-edit/multimedia-edit.component';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-multimedia-form',
  templateUrl: './multimedia-form.page.html',
  styleUrls: ['./multimedia-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MultimediaEditComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonText
  ]
})
export class MultimediaFormPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
