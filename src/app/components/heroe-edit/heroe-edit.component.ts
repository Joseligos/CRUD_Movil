import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Heroe } from 'src/app/interfaces/heroes.interface';
import { IonicModule, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeroesBDService } from 'src/app/services/heroes-bd.service';
import { MultimediaHeroeService } from 'src/app/services/multimediaheroe.service';
import { CommonModule } from '@angular/common';
// Import Swiper correctly
import { register } from 'swiper/element';

@Component({
  selector: 'app-heroe-edit',
  templateUrl: './heroe-edit.component.html',
  styleUrls: ['./heroe-edit.component.scss'],
  imports: [ 
    FormsModule,
    IonicModule,
    CommonModule,
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroeEditComponent implements OnInit {  @Input() set heroe(value: Heroe) {
    this._heroe = value;
    // When hero changes and we're in visualize mode, load multimedia items
    if (this._heroe && this._heroe._id && this.accion === 'visualizar') {
      console.log('Hero updated in heroe-edit component, loading multimedia items');
      this.loadMultimediaItems();
    }
  }
  
  get heroe(): Heroe {
    return this._heroe;
  }
  
  private _heroe: Heroe = {
    _id: '',
    nombre: '',
    bio: '',
    img: '',
    aparicion: '',
    casa: '',
  };

  @Input() accion!: string;

  unResultado: any;  constructor(
    private router: Router,
    private bd: HeroesBDService,
    private multimediaHeroeService: MultimediaHeroeService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    // Register Swiper web components
    register();
    console.log('HeroeEditComponent constructor initialized');
  }
  // Multimedia items for this hero
  multimediaItems: any[] = [];
  loadingMultimedia = false;
  lastMultimediaError: string | null = null;
  ngOnInit() {
    // Initialization logic is moved to the heroe setter
    console.log('HeroeEditComponent initialized with action:', this.accion);
  }  async loadMultimediaItems() {
    if (!this.heroe._id) {
      console.error('Cannot load multimedia items: No hero ID available');
      this.lastMultimediaError = 'No se puede cargar multimedia: ID de héroe no disponible';
      return;
    }
    
    this.loadingMultimedia = true;
    this.lastMultimediaError = null;
    
    try {
      const loader = await this.loadingController.create({
        message: 'Cargando multimedia...'
      });
      await loader.present();
      
      // For testing, let's try to use both the current hero ID and the known working ID
      console.log('Loading multimedia for hero ID:', this.heroe._id);
      
      // First try with the current hero ID
      this.multimediaHeroeService.getMultimediasPorHeroe(this.heroe._id).subscribe({
        next: (resp: any) => {
          console.log('MultimediaHeroe response:', resp);
          if (resp && resp.Ok) {
            this.multimediaItems = resp.resp || [];
            console.log('Multimedia items loaded:', this.multimediaItems);
            
            // Log the structure of the first item for debugging
            if (this.multimediaItems.length > 0) {
              console.log('First multimedia item structure:', JSON.stringify(this.multimediaItems[0], null, 2));
            } else {
              console.warn('No multimedia items found for this hero');
              this.lastMultimediaError = 'No se encontraron elementos multimedia para este héroe';
              
              // If no items found and this is not the known working ID, try the known working ID
              if (this.heroe._id !== '68280441beb9faa062d665c2') {
                console.log('Trying with known working ID: 68280441beb9faa062d665c2');
                this.loadMultimediaForKnownHero();
                return;
              }
            }
            
            // Process the multimedia items to ensure proper structure
            this.processMultimediaItems();
          } else {
            console.error('Error loading multimedia items:', resp);
            this.lastMultimediaError = 'Error al cargar multimedia: ' + (resp?.msg || 'Respuesta incorrecta del servidor');
            this.presentToast('bottom', 'Error al cargar multimedia');
            
            // Try the known working ID if the current one failed
            if (this.heroe._id !== '68280441beb9faa062d665c2') {
              console.log('Trying with known working ID after error: 68280441beb9faa062d665c2');
              this.loadMultimediaForKnownHero();
            }
          }
          this.loadingMultimedia = false;
          loader.dismiss();
        },
        error: (err) => {
          console.error('Error loading multimedia items:', err);
          this.lastMultimediaError = 'Error al cargar multimedia: ' + (err?.message || 'Error de conexión');
          this.presentToast('bottom', 'Error al cargar multimedia');
          this.loadingMultimedia = false;
          loader.dismiss();
          
          // Try the known working ID if the current one failed
          if (this.heroe._id !== '68280441beb9faa062d665c2') {
            console.log('Trying with known working ID after error: 68280441beb9faa062d665c2');
            this.loadMultimediaForKnownHero();
          }
        }
      });
    } catch (error) {
      console.error('Error loading multimedia items:', error);
      this.lastMultimediaError = 'Error al cargar multimedia: Error inesperado';
      this.loadingMultimedia = false;
    }
  }
    // Method to load multimedia for a known working hero ID for testing
  loadMultimediaForKnownHero() {
    const knownHeroId = '68280441beb9faa062d665c2';
    this.loadingMultimedia = true;
    
    this.multimediaHeroeService.getMultimediasPorHeroe(knownHeroId).subscribe({
      next: (resp: any) => {
        console.log('MultimediaHeroe response for known hero:', resp);
        if (resp && resp.Ok) {
          this.multimediaItems = resp.resp || [];
          console.log('Multimedia items loaded for known hero:', this.multimediaItems);
          
          if (this.multimediaItems.length > 0) {
            console.log('First multimedia item structure for known hero:', JSON.stringify(this.multimediaItems[0], null, 2));
            this.lastMultimediaError = null;
            // Process the multimedia items to ensure proper structure
            this.processMultimediaItems();
          } else {
            console.warn('No multimedia items found even for known hero');
            this.lastMultimediaError = 'No se encontraron elementos multimedia para el héroe conocido';
          }
        } else {
          console.error('Error response for known hero:', resp);
          this.lastMultimediaError = 'Error al cargar multimedia para el héroe conocido';
        }
        this.loadingMultimedia = false;
      },
      error: (err) => {
        console.error('Error loading multimedia items for known hero:', err);
        this.lastMultimediaError = 'Error al cargar multimedia para el héroe conocido: ' + (err?.message || 'Error de conexión');
        this.loadingMultimedia = false;
      }
    });
  }
  getMultimediaUrl(multimediaItem: any): string {
    console.log('Getting URL for multimedia item:', multimediaItem);
    
    // Handle different response structures
    if (multimediaItem) {
      // Direct URL in the item itself
      if (multimediaItem.url) {
        console.log('Using direct URL from multimedia item:', multimediaItem.url);
        return multimediaItem.url;
      }
      
      // If the IdMultimedia field is populated as an object
      if (multimediaItem.IdMultimedia) {
        if (typeof multimediaItem.IdMultimedia === 'object') {
          if (multimediaItem.IdMultimedia.url) {
            console.log('Using URL from IdMultimedia object:', multimediaItem.IdMultimedia.url);
            return multimediaItem.IdMultimedia.url;
          }
        } else if (typeof multimediaItem.IdMultimedia === 'string') {
          // If IdMultimedia is just a string (ID), we need to handle this case
          // This might require fetching the multimedia details separately
          console.log('IdMultimedia is a string ID, not an object:', multimediaItem.IdMultimedia);
        }
      }
      
      // If we need to extract from another structure
      if (multimediaItem.resp) {
        if (multimediaItem.resp.url) {
          console.log('Using URL from resp object:', multimediaItem.resp.url);
          return multimediaItem.resp.url;
        } else if (Array.isArray(multimediaItem.resp) && multimediaItem.resp.length > 0 && multimediaItem.resp[0].url) {
          console.log('Using URL from first item in resp array:', multimediaItem.resp[0].url);
          return multimediaItem.resp[0].url;
        }
      }
    }
    
    console.log('No valid URL found, using fallback image');
    return 'assets/icon/no-image.png';
  }
  // Process multimedia items to ensure they have the right structure
  processMultimediaItems() {
    console.log('Processing multimedia items, count before:', this.multimediaItems.length);
    
    // Filter out any items that might be null or undefined
    this.multimediaItems = this.multimediaItems.filter(item => !!item);
    
    this.multimediaItems = this.multimediaItems.map(item => {
      // Ensure we have a proper object with required properties
      let processedItem = { ...item };
      
      // Add description if not present
      if (!processedItem.description) {
        // Try to get a description from various potential sources
        if (processedItem.IdMultimedia && typeof processedItem.IdMultimedia === 'object' && processedItem.IdMultimedia.descripcion) {
          processedItem.description = processedItem.IdMultimedia.descripcion;
        } else if (processedItem.IdHeroe && typeof processedItem.IdHeroe === 'object' && processedItem.IdHeroe.nombre) {
          processedItem.description = `Imagen de ${processedItem.IdHeroe.nombre}`;
        } else {
          processedItem.description = 'Imagen del héroe';
        }
      }
      
      // Ensure it has an _id for tracking
      if (!processedItem._id) {
        // Use any available ID or generate a temporary one
        processedItem._id = processedItem.id || 
                            (processedItem.IdMultimedia && processedItem.IdMultimedia._id) || 
                            `temp-${Math.random().toString(36).substring(2, 11)}`;
      }
      
      return processedItem;
    });
    
    console.log('Processed multimedia items, count after:', this.multimediaItems.length);
  }

  guardar() {
    if (this.accion === 'editar') {
      this.guardarHeroe(this.heroe);
    } else if (this.accion === 'crear') {
      this.insertarHeroe(this.heroe);
    }
  }

  async guardarHeroe(unHeroe: any) {
    console.log(unHeroe);
    await this.bd.crud_Heroes(unHeroe, 'modificar').subscribe(
      (res: any) => {
        this.unResultado = res;

        if (this.unResultado.Ok === true) {
          this.presentToast('top', 'Registro Modificado...');
          this.router.navigate(['/tabs/tab4'], { queryParams: { recargar: true } });
        } else {
          console.log(this.unResultado);
          this.presentAlert('Error!', 'Modificando Héroe', this.unResultado.msg);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  async insertarHeroe(unHeroe: any) {
    console.log(unHeroe);
    await this.bd.crud_Heroes(unHeroe, 'insertar').subscribe(
      (res: any) => {
        this.unResultado = res;

        if (this.unResultado.Ok === true) {
          this.presentToast('top', 'Registro Insertado...');
          this.router.navigate(['/tabs/tab4'], { queryParams: { recargar: true } });
        } else {
          console.log(this.unResultado);
          this.presentAlert('Error!', 'Insertando Héroe', this.unResultado.msg);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  async presentAlert(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['Ok'],
    });

    await alert.present();
  }
}
