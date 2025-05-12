# Frontend Folder Structure

This document outlines the purpose of the main directories within the `frontend-2` project, following recommended best practices for Next.js applications.

## Core Directories

*   **`app/`**
    *   **Purpose:** Handles routing (using Next.js App Router conventions), global layouts (`layout.tsx`), global styles (`globals.css`), and page entry components (e.g., `page.tsx`, `loading.tsx`, `error.tsx`).
    *   **Note:** Keep this directory focused on routing and page-level concerns. Avoid placing general reusable UI components here.

*   **`components/`**
    *   **Purpose:** Houses reusable UI components (e.g., Buttons, Cards, Modals) and potentially page-specific components composed of smaller reusable ones.
    *   **Subdirectories:** Often includes `ui/` for base UI elements (like Shadcn components) and potentially feature-specific folders (e.g., `components/auth`, `components/dashboard`).
    *   **Goal:** Promotes modularity and reusability.

*   **`lib/`**
    *   **Purpose:** Contains utility functions, helper functions, constants, and potentially API-related logic (like data fetching functions or API client setup).
    *   **Scope:** For reusable logic that isn't specific to a React component or hook.
    *   **Examples:** Date formatting utilities, validation helpers, API service definitions.

*   **`hooks/`**
    *   **Purpose:** Used for custom React hooks that encapsulate reusable stateful logic or side effects.
    *   **Scope:** Logic that needs to interact with React's state or lifecycle but can be shared across multiple components.
    *   **Examples:** `useUserData`, `useApiMutation`, `useWindowSize`.

*   **`types/`**
    *   **Purpose:** Holds shared TypeScript type definitions, interfaces, and potentially Zod schemas.
    *   **Goal:** Centralizes type management, making types easier to maintain, reference, and reuse across the application, improving type safety.

*   **`public/`**
    *   **Purpose:** Standard Next.js directory for serving static assets like images, fonts, or favicon files directly from the root URL (e.g., `/logo.png`).

## Benefits of this Structure

Adhering to this structure provides:

*   **Organizational Clarity:** Easier navigation and understanding.
*   **Modularity & Reusability:** Reduces code duplication.
*   **Scalability:** Supports project growth smoothly.
*   **Maintainability:** Simplifies debugging and refactoring.
*   **Collaboration:** Enables teams to work efficiently. 