import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { ServiceCard } from '../../components/service-card/service-card';

@Component({
  selector: 'app-home',
  imports: [Hero, SectionTitle, ServiceCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  services = [
    { title: 'Student Profile & Login', description: 'Register or log in to view digital ID card, verified records, and active portal session.', link: '/student', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { title: 'Courses & Curriculum', description: 'Browse UG B.Sc (6 Semesters) & B.Tech (8 Semesters) degree programs and semester subjects.', link: '/courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { title: 'Marks & Results', description: 'Check semester-wise grades by RRN & DOB, SGPA, CGPA, and download official marksheets.', link: '/marks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { title: 'Fees & Online Clearance', description: 'Check semester-wise fee breakdown, clear unpaid dues online, and download receipts.', link: '/fees', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Transport Bus Booking', description: 'View bus routes, shift timings, seat availability, and book digital bus passes.', link: '/transport', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { title: 'Canteen Food Ordering', description: 'Browse food menu, filter veg/non-veg, order online, and track preparation status.', link: '/canteen', icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546M12 2v3m0 0a3 3 0 100 6 3 3 0 000-6z' },
  ];

  gallery = [
    { label: 'Central Library', url: 'https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { label: 'Computer Lab', url: 'https://crescent.education/wp-content/uploads/2022/07/apple-lab_0744-1536x1024.jpg' },
    { label: 'Hostel Block', url: 'https://images.unsplash.com/photo-1629794226066-349748040fb7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { label: 'Campus Canteen', url: 'https://images.unsplash.com/photo-1559560329-e4b17eb5726b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhbnRlZW58ZW58MHx8MHx8fDA%3D' },
    { label: 'Sports Complex', url: 'https://crescent.education/wp-content/uploads/2022/07/INU2688-1536x1024.jpg' },
    { label: 'Auditorium', url: 'https://crescent.education/wp-content/uploads/2022/07/DSC_9933-1536x1025.jpg' },
  ];
}
