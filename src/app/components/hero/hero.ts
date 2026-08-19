import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  title = input.required<string>();
  subtitle = input<string>('');
  image = input<string>('');
  ctaLabel = input<string>('');
  ctaLink = input<string>('');
}
