# CampusBook

A full-stack web application for managing and booking sports facilities at a college campus. CampusBook allows students to view available facilities, book time slots, manage their bookings, and cancel bookings when required. Admins can create and manage slots and monitor bookings.

The system is designed to provide **secure authentication, role-based access, real-time slot availability, capacity management, and safe concurrent booking**.

---

##  Features

###  Student Features

* **User Authentication** – Secure student registration and login
* **Browse Facilities** – View available sports facilities and their slots
* **Slot Booking** – Book an available slot for a selected facility
* **Real-time Availability** – View current slot occupancy before booking
* **Booking Management** – View all active and previous bookings
* **Booking Cancellation** – Cancel eligible bookings
* **Gender-based Access** – Access slots according to facility/slot gender restrictions
* **Responsive UI** – Works across desktop, tablet, and mobile devices

### Admin Features

* **Admin Authentication** – Separate admin access
* **Slot Management** – Create and manage facility slots
* **Booking Monitoring** – Monitor bookings and slot occupancy
* **Facility Management** – Manage sports facilities and their availability
* **Capacity Management** – Set and monitor the maximum capacity of slots

### Security & Reliability

* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization
* Protected API routes
* Input validation
* MongoDB transactions for concurrent bookings
* Prevention of overbooking when multiple users try to book the last available slot

---

##  Quick Start

### Prerequisites

Make sure you have the following installed:

* **Node.js** 18 or higher
* **MongoDB**
* **npm**

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tarun11845/Campus-book.git
cd Campus-book
```

### 2. Install Dependencies

Install the root, backend, and frontend dependencies:

```bash
npm install
```

```bash
cd backend
npm install
cd ..
```

```bash
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MONGODB_URI=mongodb://localhost:27017/campusbook

JWT_SECRET=your-super-secret-jwt-key

PORT=4000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

If you are using a MongoDB Atlas database, replace the `MONGODB_URI` with your Atlas connection string.

---

## Running the Application

### Start Backend

```bash
npm start
```

The backend will run on:

```text
http://localhost:4000
```

### Start Frontend

Open another terminal:

```bash
npm run dev --prefix frontend
```

The frontend will run on:

```text
http://localhost:5173
```

### Run Both Together

If the root project is configured with the required scripts:

```bash
npm run dev
```

---

## Access Points

| Service     | URL                           |
| ----------- | ----------------------------- |
| Frontend    | `http://localhost:5173`       |
| Backend API | `http://localhost:4000`       |
| Admin Panel | `http://localhost:5173/admin` |

---

#  How CampusBook Works

##  For Students

1. Create an account or log in.
2. Browse available sports facilities.
3. Select a facility.
4. View available time slots.
5. Check the current slot capacity.
6. Select an available slot.
7. Confirm the booking.
8. View the booking under **My Bookings**.
9. Cancel the booking when permitted.

---

## For Admins

1. Log in using an admin account.
2. Open the Admin Panel.
3. Select the required sports facility.
4. Create or manage available time slots.
5. Set slot capacity and other restrictions.
6. Monitor bookings and occupancy.
7. Manage existing slots when required.

---

#  System Architecture

CampusBook follows a **three-tier architecture**:

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│  Components / Pages /       │
│  Contexts / UI              │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│      Node.js + Express      │
│                             │
│ Routes → Controllers →      │
│ Services → Models           │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users / Facilities / Slots  │
│ Bookings                    │
└─────────────────────────────┘
```

### Request Flow

```text
User
 ↓
React Frontend
 ↓
Express API
 ↓
Authentication / Authorization
 ↓
Controller
 ↓
Service / Business Logic
 ↓
Mongoose Models
 ↓
MongoDB
```

---

#  Project Structure

```text
Campus-book/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Slot.js
│   │   │   ├── Booking.js
│   │   │   └── Sport.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── slotRoutes.js
│   │   │   └── sportRoutes.js
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── middleware/
│   │   │   ├── authentication
│   │   │   └── authorization
│   │   │
│   │   └── services/
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── assets/
│   │
│   └── package.json
│
├── setup.js
├── package.json
└── README.md
```

---

#  Database Design

CampusBook uses **MongoDB with Mongoose**.

## Users

Stores student and administrator information.

```text
User
├── name
├── email
├── password
└── role
```

Possible roles:

```text
student
admin
```

Passwords are securely hashed before being stored.

---

## Sports / Facilities

Stores information about the sports facilities available in the campus.

```text
Sport
├── name
├── description
├── capacity
└── other fac
```
