# Sahara Frontend

### Languages and Tools

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

The frontend for **Sahara**, a fictional e-commerce storefront. A starter frontend was provided as part of the capstone but I wanted to keep Angular fresh in my mind so I scrapped it and decided to start a new angular project.


<table>
  <tr>
    <td><img width="400" alt="Home" src="https://github.com/user-attachments/assets/b3b576c6-f88d-4e7b-9d21-1f6b92a6db70" /></td>
    <td><img width="400" alt="Product" src="https://github.com/user-attachments/assets/508c67bf-968a-43a8-9ea3-500c1e2ff475" /></td>
  </tr>
  <tr>
    <td><img width="400" alt="Cart" src="https://github.com/user-attachments/assets/ddc65586-aba8-4931-b39a-9e329bfd2742" /></td>
    <td><img width="400" alt="Checkout" src="https://github.com/user-attachments/assets/06b21ca7-cdfb-429d-bd95-abf7a65bafcf" /></td>
  </tr>
  <tr>
    <td colspan="2"><img width="400" alt="Stripe" src="https://github.com/user-attachments/assets/772af4b1-3d1e-464b-8efd-9907a8ab095a" /></td>
  </tr>
</table>

*(if only this was real lol)*

**Check out the website here!** https://sahara.andytang.tech
**Check out the backend repo!** [sahara-backend-api-capstone](https://github.com/yu26s9-decypted/sahara-backend-api-capstone)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Angular Signals |
| HTTP | Angular HttpClient + Interceptors |
| Payments | Stripe.js |
| Deployment | Vercel |

## Features

- Product catalog with name search and category filtering
- Product detail pages with add to cart
- Shopping cart with optimistic updates and debounced quantity changes
- Multi-step checkout with Stripe Elements
- JWT auth with automatic token injection via HTTP interceptor
- User profile page with prefilled shipping address at checkout
- Cart count badge in navbar synced across the app

## Getting Started

### Prerequisites
- Node.js 18+, Angular CLI

### Setup

```bash
git clone https://github.com/yu26s9-decypted/sahara-capstone3-angular-frontend.git
cd sahara-capstone3-angular-frontend
npm install
ng serve
```

App starts on `http://localhost:4200`.

Set your environment variables in `src/environment/environment.ts`:

```typescript
export const environment = {
    production: false,
    baseURL: 'http://localhost:8080',
    stripePublishableKey: 'pk_test_your_key_here'
};
```

---
