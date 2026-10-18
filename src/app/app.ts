import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacionService } from './core/services/notificacion.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly notificaciones = inject(NotificacionService);
}
