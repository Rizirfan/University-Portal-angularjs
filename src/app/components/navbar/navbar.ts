import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  mobileOpen = signal(false);

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/student', label: 'Student Profile', exact: false },
    { path: '/courses', label: 'Courses', exact: false },
    { path: '/marks', label: 'Marks', exact: false },
    { path: '/hostel', label: 'Hostel', exact: false },
    { path: '/transport', label: 'Transport', exact: false },
    { path: '/fees', label: 'Fees', exact: false },
    { path: '/canteen', label: 'Canteen', exact: false },
  ];

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }
}
