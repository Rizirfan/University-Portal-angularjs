import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-card',
  imports: [RouterLink],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css'
})
export class ServiceCard {
  icon = input<string>('M13 10V3L4 14h7v7l9-11h-7z');
  title = input.required<string>();
  description = input<string>('');
  link = input<string>('');
}
