<div align="center"><img src = "https://user-images.githubusercontent.com/31413093/197097625-5b3bd3cf-2bd6-4a3a-8059-a1fe9f28100b.svg" height="100px" alt="My Happy SVG"/></div>

<h2 align="center">nextworld-fe</h2>

<div align="center">
<a href="https://reactjs.org/"><image src="https://img.shields.io/static/v1?label=React&message=v19&style=flat-square&logo=react&color=61DAFB"/></a> <a href="https://www.typescriptlang.org/"><image src="https://img.shields.io/static/v1?label=TypeScript&message=v5&style=flat-square&logo=typescript&color=3178C6"/></a> <a href="https://www.typescriptlang.org/"><image src="https://img.shields.io/static/v1?label=Tailwind%20CSS&message=v4&style=flat-square&logo=tailwindcss&color=06B6D4"/></a> <a href="https://cn.vitejs.dev/"><image src="https://img.shields.io/static/v1?label=Vite&message=v7&style=flat-square&logo=vite&color=00ccb1"/> <a href="https://cn.vitejs.dev/"><image src="https://img.shields.io/static/v1?label=Framer&message=v12&style=flat-square&logo=framer&color=ff57c8"/></a>
</div>

## Introduction

A modern [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) starter template with:

### Core Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Animation library

### Design System

- **Style Dictionary** - Design token management
- **SVGR** - SVG to React component transformer

### State Management & Data Fetching

- **React Router 7** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### Developer Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **MSW (Mock Service Worker)** - API mocking

This template includes elegant framer motion example components and a complete setup for building production-ready applications.

## Install

> This project uses [node](http://nodejs.org) (>= 20) and a package manager ([npm](https://npmjs.com), [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)). Go check them out if you don't have them locally installed.

Clone the repository and install dependencies:

```sh
$ git clone <repository-url>
$ cd nextworld-fe
$ pnpm install

# npm install
# yarn install
```

## Usage

### Development

Let's run the development server!

```sh
$ pnpm run dev

# npm run dev
# yarn run dev
```

### Build Design Tokens

To rebuild design tokens from the `design-tokens` directory:

```sh
$ pnpm run build-token

# npm run build-token
# yarn run build-token
```

### Production Build

```sh
$ pnpm run build

# npm run build
# yarn run build
```

> We've already implemented recommended configurations in `eslint.config.ts` and `.prettierrc`. Feel free to edit them if you have your own preferences.

## Related Efforts

- [Vite](https://github.com/vitejs/vite)
- [React](https://github.com/facebook/react)
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
- [Framer Motion](https://github.com/framer/motion)
- [Style Dictionary](https://github.com/amzn/style-dictionary)
- [React Router](https://github.com/remix-run/react-router)
- [TanStack Query](https://github.com/TanStack/query)
- [Axios](https://github.com/axios/axios)
- [MSW](https://github.com/mswjs/msw)

## Related Docs

- [Vite](https://vitejs.dev/guide/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Framer Motion](https://www.framer.com/motion/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/docs/intro)
- [MSW](https://mswjs.io/docs/)

## Features

- ⚡️ **Lightning Fast HMR** with Vite
- 🎨 **Design Tokens** powered by Style Dictionary
- 🎭 **Smooth Animations** with Framer Motion
- 🎯 **Type Safety** with TypeScript
- 🚀 **Server State Management** with TanStack Query
- 🎪 **API Mocking** with MSW for development
- 🎨 **Utility-First CSS** with Tailwind CSS 4
- 📦 **SVG as React Components** with SVGR
- 🛣️ **Client-Side Routing** with React Router 7

## License

[MIT](LICENSE)
