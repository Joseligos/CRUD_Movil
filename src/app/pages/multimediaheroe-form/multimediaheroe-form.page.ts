import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultimediaHeroeEditComponent } from '../../components/multimediaheroe-edit/multimediaheroe-edit.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-multimediaheroe-form',
  templateUrl: './multimediaheroe-form.page.html',
  styleUrls: ['./multimediaheroe-form.page.scss'],
  standalone: true,
  imports: [CommonModule, MultimediaHeroeEditComponent, IonContent]
})
export class MultimediaHeroeFormPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
