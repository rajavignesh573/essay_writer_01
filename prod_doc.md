# Micro SaaS Essay Writer – Product & Technical Specification

## Overview
Build a micro SaaS web application for students that helps generate essays based on a given prompt. The system must be simple, lean, secure, and aesthetically pleasing, while supporting authentication, subscriptions, usage tracking, and history management.

---

## Core Functionality
- An essay writer tool that generates essays based on a user-provided prompt.
- Essays are generated using **GPT-5 mini** as the LLM API.
- Users can edit generated essays inside the web application before downloading or copying.
- Users can revisit previously generated essays at any time.

---

## Tech Stack
### Frontend
- **Next.js** for the web application frontend.
- Clean, minimal, and visually appealing UI/UX.
- Responsive design optimized for desktop and mobile.
- Copying text directly from the webpage must be restricted.

### Backend
- **Supabase** as the backend:
  - Authentication
  - Database
  - User management
  - Activity and usage tracking

---

## Authentication & User Management
- Login and signup system implemented using **Google OAuth**.
- Each user must have a unique account.
- The first registered user receives **2 free essay credits**.
- All user actions must be tracked and logged securely.

---

## Essay Usage & Credits
- Each essay generation consumes **1 essay credit**.
- Essay credits are tracked per user.
- Users cannot generate essays if they have zero credits remaining.

---

## Subscription Model
### Pricing Plans
- **Monthly Plan**
  - Price: $19
  - Includes: 20 essay credits per month
- **Annual Plan**
  - Price: $190
  - Includes: 300 essay credits total

### Payment & Billing
- Payments must be processed using **Stripe**.
- Stripe must handle:
  - Subscription payments
  - Invoices
  - Payment status tracking
- Users can upgrade, renew, or cancel subscriptions.
- Credits must be allocated automatically after successful payment.

---

## Payment Integration
- Use **Stripe** for:
  - Subscription management
  - Secure payment processing
  - Invoice generation
- Payment flow must be secure and compliant with best practices.

---

## Essay History & User Data
- Store and maintain:
  - User prompts
  - Generated essays
  - Timestamps
  - Credit usage
- Users must be able to:
  - View their essay history
  - Edit essays again
  - Download essays at any time

---

## Editor & Content Control
- Built-in text editor allowing users to modify essays before downloading.
- Users **cannot copy text directly** from the webpage using default browser copy actions.
- Copying or downloading content must be done **only** via a dedicated “Copy” or “Download” button provided in the UI.

---

## Activity Tracking & Security
- Track all user actions, including:
  - Logins
  - Essay generations
  - Edits
  - Downloads
  - Payments
- Ensure data privacy and secure storage.
- Follow best security practices for authentication, API access, and payments.

---

## UI / UX Requirements
- The application must be:
  - Aesthetic
  - Simple
  - Intuitive
  - Pleasant to use
- Avoid unnecessary complexity.
- Focus on clarity, usability, and performance.

---

## Non-Functional Requirements
- High performance and scalability.
- Secure handling of user data and payments.
- Lean architecture with minimal overhead.
- Easy to maintain and extend in the future.

---

## Summary
This micro SaaS application is a subscription-based essay writer for students, built with Next.js and Supabase, using GPT-5 mini for essay generation, Stripe for payments, Google OAuth for authentication, and a strong focus on usability, security, and simplicity.
s