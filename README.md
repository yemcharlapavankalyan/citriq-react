## CRITIQ – Peer Review and Collaboration Platform

React + Vite + CSS demo for SDP Review 1.

### Setup

```bash
npm install
npm run dev
```

### Routes

- /login: select role (Admin/Student)
- /dashboard: student dashboard and collaboration board
- /reviews: submit feedback (rating + comments)
- /admin: assignments and basic stats (admin only)

### Tech

- React 19, Vite, Tailwind CSS 4
- React Router, useReducer state, localStorage persistence
- Framer Motion ready (installed)

### Team Roles (example)

- Member 1: Concept & features
- Member 2: UI & responsiveness
- Member 3: Logic & code walkthrough
- Member 4: Collaboration & future improvements

### Git Commit Plan (sample)

1. chore: init vite react and tailwind
2. feat(router): add routes /login /dashboard /reviews /admin
3. feat(ui): navbar layout and basic pages
4. feat(auth): mock role-based auth with localStorage
5. feat(state): add useReducer and context for reviews/feedback
6. feat(reviews): feedback form and persistence
7. feat(admin): admin dashboard cards and assignments
8. style: responsive tweaks and animations
9. docs: update README with setup and roles

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
