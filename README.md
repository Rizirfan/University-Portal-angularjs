# University Portal

A comprehensive university campus services portal built with Angular 21. This single-page application provides students with a one-stop platform for managing their academic and campus life — from viewing digital ID cards and exam results to booking hostel rooms, transport passes, and ordering food from the canteen.

## Features

- **Student Profile** — Login/Register with a unique Roll Number (RRN), digital student ID card with QR code, and profile management
- **Courses & Curriculum** — Browse degree programs, view semester-wise syllabi, and filter by department
- **Marks & Results** — Check semester exam results, SGPA/CGPA, and export marksheets as CSV
- **Fees & Payment** — View semester fee breakdowns, make payments (UPI/NetBanking/Card), and download receipts
- **Hostel Booking** — Browse hostel blocks, check room availability, and book accommodation
- **Transport** — View bus routes, book monthly passes with multi-month discounts, and generate QR passes
- **Canteen** — Browse menu items, filter by veg/non-veg, add to cart, and place orders for takeaway/dine-in/delivery

## Tech Stack

- [Angular](https://angular.dev/) v21 with standalone components and signals
- [Tailwind CSS](https://tailwindcss.com/) v4 for styling
- TypeScript v5.9
- RxJS BehaviorSubject + Angular Signals for reactive state
- localStorage for data persistence (no backend required)

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.9.3

### Installation

```bash
git clone https://github.com/Rizirfan/University-Portal-angularjs.git
cd University-Portal-angularjs
npm install
```

### Development Server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The app will reload on source file changes.

### Build

```bash
npm run build
```

Build artifacts are output to the `dist/` directory.

## Project Structure

```
src/app/
├── models/          # TypeScript interfaces (Student, Marks, Fees, Hostel, etc.)
├── services/        # Injectable services (Data, Student, Marks, Fees, Hostel, Transport, Canteen)
├── components/      # Shared UI components (Navbar, Footer, Hero, ServiceCard, CourseCard)
├── pages/           # Page-level route components (Home, Student, Courses, Marks, Fees, Hostel, Transport, Canteen)
└── assets/data/     # Static JSON seed data
```

## License

This project is open source.
