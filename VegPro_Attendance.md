# VegPro Attendance Management System (MVP)

## Project Overview

Build a **minimal, mobile-first attendance management web application**
for a startup named **VegPro**.

This is an **MVP/prototype**, not a complete HRMS. The primary goal is
to make attendance marking effortless for workers and attendance
management simple for the owner.

The application will be used almost entirely on **mobile phones**, so
every screen should be designed mobile-first with large buttons, clear
text, and minimal navigation.

The owner is not highly technical, and most staff members are
semi-skilled or uneducated. The UI should be intuitive enough that
someone can use it without any training.

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React (Vite)
-   React Router
-   Tailwind CSS
-   Axios

## Backend

-   Node.js
-   Express.js

## Database

-   Supabase PostgreSQL
-   Prisma ORM

## Authentication

-   JWT Authentication
-   bcrypt for password hashing

## Deployment

-   Frontend: Vercel (Free)
-   Backend: Render (Free)
-   Database: Supabase PostgreSQL (Free Tier)

Supabase is chosen because it provides a managed PostgreSQL database
with persistent storage, generous free limits, and seamless Prisma
integration.

------------------------------------------------------------------------

# Design Guidelines

-   Mobile-first UI
-   White background
-   Green primary color (#22c55e)
-   Large fonts
-   Large touch-friendly buttons
-   Clean cards
-   Minimal navigation
-   No unnecessary animations
-   No complex tables on mobile

------------------------------------------------------------------------

# Authentication Flow

There should be **only one login page**.

No separate Admin and Staff login pages.

## Login Screen

Display:

-   VegPro Logo
-   Mobile Number input
-   Continue button

### Staff Login

If the mobile number belongs to a Staff:

-   No password required.
-   Login immediately.
-   Redirect to Staff Dashboard.

### Admin Login

If the mobile number belongs to an Admin:

-   After clicking Continue, reveal a Password field.
-   Validate password.
-   Redirect to Admin Dashboard after successful authentication.

------------------------------------------------------------------------

# User Roles

-   Admin
-   Staff

------------------------------------------------------------------------

# Staff Dashboard

Display only:

-   Greeting
-   Current Date
-   Current Time
-   Large **MARK ATTENDANCE** button

On click:

Store:

-   Employee ID
-   Current Date
-   Current Time
-   Status = Present

After success:

-   Attendance Marked Successfully
-   Display Check-in Time
-   Disable button for the remainder of the day.

If already marked:

> Attendance already marked today.

No other functionality should be available to staff.

------------------------------------------------------------------------

# Admin Dashboard

## Header

-   VegPro
-   Today's Date
-   Logout

## Summary

-   Total Staff
-   Present Today
-   Absent Today

## Staff Management

Admin can:

-   Add Staff
-   Edit Staff
-   Delete Staff

Staff fields:

-   Name
-   Mobile Number

## Admin Management

Admin can:

-   Add Admin
-   Edit Admin
-   Delete Admin

Admin fields:

-   Name
-   Mobile Number
-   Password

## Today's Attendance

Display:

-   Employee Name
-   Mobile Number
-   Check-in Time
-   Status

## Attendance History

Admin can:

-   Select a staff member
-   View complete attendance history

Each record:

-   Date
-   Check-in Time
-   Status

Simple date filter is optional.

No charts or analytics.

------------------------------------------------------------------------

# Attendance Rules

-   One attendance per employee per day.
-   Automatically store:
    -   Employee ID
    -   Date
    -   Check-in Time
    -   Status

------------------------------------------------------------------------

# Database Schema

## Users

-   id
-   name
-   mobile
-   password (nullable for staff)
-   role
-   createdAt

## Attendance

-   id
-   userId
-   date
-   checkInTime
-   status
-   createdAt

------------------------------------------------------------------------

# REST APIs

## Authentication

-   POST /login

## Staff

-   GET /staff
-   POST /staff
-   PUT /staff/:id
-   DELETE /staff/:id

## Admin

-   GET /admins
-   POST /admins
-   PUT /admins/:id
-   DELETE /admins/:id

## Attendance

-   POST /attendance/checkin
-   GET /attendance/today
-   GET /attendance/history
-   GET /attendance/user/:id

------------------------------------------------------------------------

# Validation

-   Mobile number must be unique.
-   Staff can mark attendance only once per day.
-   Name is mandatory.
-   Mobile number is mandatory.
-   Admin password minimum 4 characters.

------------------------------------------------------------------------

# Suggested Folder Structure

``` text
vegpro-attendance/
├── frontend/
└── backend/
```

Frontend

``` text
src/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
└── App.jsx
```

Backend

``` text
routes/
controllers/
services/
repositories/
middleware/
utils/
prisma/
server.js
```

------------------------------------------------------------------------

# UI Principles

-   Mobile-first
-   Responsive
-   Large buttons
-   Large readable fonts
-   Card-based layout
-   No horizontal scrolling
-   One primary action per screen

------------------------------------------------------------------------

# Code Quality Requirement

Follow a **production-ready architecture** with clear separation of
concerns.

Organize the backend into:

-   Controllers
-   Services
-   Repositories
-   Middleware
-   Utilities
-   Prisma

Organize the frontend into reusable:

-   Components
-   Layouts
-   Pages
-   Services
-   Hooks

Even though this is an MVP, write clean, maintainable, modular code that
can scale as new features are added without requiring major refactoring.

Use proper error handling, validation, reusable components, and
consistent coding practices throughout the project.

------------------------------------------------------------------------

# Do NOT Add

-   Payroll
-   Salary
-   Leave Management
-   QR Code
-   GPS Tracking
-   Face Recognition
-   OTP Authentication
-   Email Verification
-   Notifications
-   Charts
-   Analytics
-   Reports
-   Shift Management
-   Multi-Branch Support
-   Dark Mode
-   Camera Features
-   Geofencing

------------------------------------------------------------------------

# Future Scope (Do Not Implement)

-   Check-out
-   Monthly attendance reports
-   Leave management
-   Salary integration
-   Excel/PDF export
-   WhatsApp reminders
-   Fingerprint/Biometric attendance
-   GPS verification
-   Face recognition
-   Progressive Web App (PWA)

------------------------------------------------------------------------

# Overall Goal

Build a fast, lightweight, mobile-first attendance system for VegPro.
Staff should be able to mark attendance in a single tap after entering
their mobile number. Admins should have a simple dashboard to manage
staff, manage other admins, and view current and historical attendance.
Prioritize simplicity, maintainability, scalability, and clean
architecture while keeping the entire solution deployable on free
services (Vercel, Render, and Supabase).
