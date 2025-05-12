---
description: Details the technologies, development setup, technical constraints, dependencies, and tool usage patterns for the GHOSTLY+ Dashboard.
source_documents: [docs/prd.md](mdc:docs/prd.md) (Section 4), [docs/security.md](mdc:docs/security.md)
---

# GHOSTLY+ Dashboard: Technical Context

## 1. Core Technologies

### 1.1. Frontend (Web Dashboard - WP2)

- **Framework:** **Next.js (v14+ with App Router)** using **React (v19+)**
- **Language:** TypeScript
- **UI Components:** shadcn/ui (built on Radix UI primitives)
- **Styling:** Tailwind CSS (v3.4+)
- **State Management:** React Context API (initially, potentially Zustand or others later if complexity increases)
- **Routing:** Next.js App Router
- **Build Tool:** Next.js CLI (using Webpack or Turbopack)
- **Package Manager:** npm
- **Rationale for Switch**: Moved from Vue.js to leverage the React ecosystem, Next.js's integrated full-stack features (App Router, Server Components, API Routes, optimizations), improve developer experience, and address specific UI library integration challenges encountered with Vue.

*(Previous Stack: Vue.js 3, Vite, Pinia, Vue Router, shadcn-vue)*

### 1.2. Backend (Service Layer - WP3)

- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Data Validation:** Pydantic
- **Database Interaction:** SQLAlchemy (for potential future DB interactions beyond Supabase direct access)
- **Package Manager:** Poetry

### 1.3. Database & BaaS (Data Infrastructure - WP4)

- **Platform:** Supabase (Self-Hosted on VUB Private VM)
- **Core Database:** PostgreSQL (v15+)
- **Authentication:** Supabase Auth (GoTrue)
- **Storage:** Supabase Storage
- **API Gateway:** Supabase Kong
- **Realtime:** Supabase Realtime (Currently disabled in local dev)
- **Edge Functions:** Supabase Edge Functions (Deno Runtime) - *Used for specific privileged operations or transformations.*

### 1.4. Containerization & Orchestration (Deployment - WP6)

- **Containerization:** Docker
- **Orchestration (Local Dev):** Docker Compose
- **Reverse Proxy (Local Dev & Prod):** Nginx

### 1.5. Game Client Integration (WP1)

- **Platform:** Android
- **Framework:** MonoGame (via OpenFeasyo)
- **Language:** C#
- **Sensors:** Delsys Trigno EMG

## 2. Development Setup

- **Environment:** Dockerized setup using Docker Compose for local development, encompassing frontend, backend, Supabase services, and Nginx.
- **Source Control:** Git (Hosted on GitHub)
- **Package Managers:** npm (frontend), Poetry (backend)
- **Linters/Formatters:**
    - Frontend: ESLint (v9+ with flat config), Prettier
    - Backend: Ruff
- **IDE/Editor:** Visual Studio Code recommended, with relevant extensions (Docker, Python, Vue/Volar, TypeScript, Tailwind CSS IntelliSense, Prettier, ESLint, Ruff).
- **Task Management:** Task Master CLI / MCP Tools (using `tasks.json` and generated markdown files).

## 3. Technical Constraints

- **Self-Hosted Supabase:** The entire Supabase instance runs on a private VUB VM, not Supabase Cloud. This impacts deployment, maintenance, and potentially available Supabase features/extensions.
- **GDPR Compliance:** Strict adherence required due to handling sensitive medical (EMG) data. Pseudonymization and encryption are key requirements.
- **Existing Game Client:** The dashboard must integrate with the existing C#/MonoGame Android application.
- **M1 Mac Compatibility:** Local Supabase setup requires specific Docker configurations (`platform: linux/arm64` for some services, manual Docker Compose preferred over `npx supabase start`).

## 4. Key Dependencies & Libraries

### 4.1. Frontend (`frontend-2/package.json`)

- `next`: Core Next.js framework
- `react`, `react-dom`: React library
- `@supabase/supabase-js`: Client-side Supabase interactions
- `@supabase/ssr`: Server-side Supabase helpers for Next.js
- `tailwindcss`: Utility-first CSS framework
- `shadcn-ui`, `@radix-ui/*`: UI components and primitives
- `lucide-react`: Icon library
- `typescript`, `@types/*`: TypeScript support
- `eslint`, `prettier`: Linting and formatting
- `next-themes`: Dark mode / theme handling

*(Dependencies reflect the switch to Next.js/React. Previous Vue-specific dependencies like `vue`, `vite`, `pinia`, `vue-router`, `shadcn-vue`, `lucide-vue-next` are no longer relevant for `frontend-2`.)*

### 4.2. Backend (`backend/pyproject.toml`)

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation
- `sqlalchemy`: ORM (for potential future use)
- `python-jose[cryptography]`: JWT handling
- `supabase-py`: Python client for Supabase (if needed by FastAPI directly)
- `python-dotenv`: Environment variable management
- `py-bcrypt`: Password hashing (if needed outside Supabase Auth)
- `ruff`: Linter/Formatter

### 4.3. Supabase / Infrastructure

- Docker Engine & Docker Compose
- Nginx
- PostgreSQL (`pgsodium` extension recommended for encryption)
- Deno (for Edge Functions)

## 5. Tool Usage Patterns

- **Docker Compose:** Used for starting/stopping the entire local development stack (`docker-compose up --build`, `docker-compose down`). Specific Supabase services managed via `docker compose -f supabase_config/docker-compose.yml up -d`.
- **npm:** Used for all frontend dependency management, running scripts (`npm run dev`, `npm run build`, `npm run lint`).
- **Poetry:** Used for all backend dependency management and running scripts (`poetry install`, `poetry run ...`).
- **Supabase CLI:** Used for managing migrations, generating types, interacting with the local/remote Supabase instance (`supabase login`, `supabase link`, `supabase migration`, `supabase functions new/deploy`, `supabase gen types typescript`). **Note:** `supabase start` avoided due to M1 issues; manual compose used instead.
- **Task Master:** Used via MCP server tools or `task-master` CLI for managing project tasks defined in `tasks/tasks.json`.
- **Git:** Standard Git workflow (feature branches, commits, PRs).
- **Shadcn UI CLI:** (`npx shadcn@latest add ...`) used to add UI components to the `frontend-2` project.

## 6. API & Security Configuration

- **Authentication:** JWT-based via Supabase Auth. Tokens issued by Supabase are validated by backend services (FastAPI, Edge Functions).
- **Authorization:** Primarily handled by RLS policies in Supabase PostgreSQL. Role-based logic can be implemented in backend services or Edge Functions where needed.
- **CORS:** Configured in Supabase Kong (via `supabase_cors_config.sh` or Studio) and potentially in FastAPI if needed. Nginx proxy configuration also handles routing.
- **Secrets Management:** API keys, JWT secrets, service keys stored in `.env` files (root for Docker Compose/Supabase, `frontend-2` for Next.js build-time vars, `backend` for FastAPI). **SERVICE_ROLE_KEY and other sensitive keys MUST NOT be exposed client-side.** Edge Functions provide a secure environment for using `service_role`.
- **Environment Variables:**
    - `frontend-2`: Uses `NEXT_PUBLIC_` prefix for browser-accessible vars (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Server-side logic in Next.js can access non-prefixed vars.
    - `backend`: Loaded via `python-dotenv`.
    - `supabase_config`: Loaded via root `.env` file by Docker Compose.

## 6.1. Role of Supabase Client Libraries

- **`@supabase/js` & `@supabase/ssr` (Frontend / Next.js Server):**
    - Used primarily for **user authentication** (login, logout, session management, auth state changes) within the browser and on the Next.js server.
    - Enables direct interaction with Supabase Database and Storage **respecting Row Level Security (RLS)** policies based on the authenticated user's JWT.
    - `@supabase/ssr` provides helpers for securely managing sessions and client instances across Next.js rendering environments (Client Components, Server Components, Route Handlers, Middleware).
    - **Crucially, these libraries are NEVER used with the `service_role` key in the frontend or standard Next.js backend logic due to security risks.**

- **`supabase-js` (Edge Functions):**
    - Used within the secure Deno runtime of Supabase Edge Functions.
    - This is the designated place to use the Supabase client **with the `service_role` key** (securely provided by the environment) to perform **privileged operations** that bypass RLS (e.g., fetching all users for an admin panel, running admin tasks).

- **`supabase-py` (FastAPI Backend - Optional Use):**
    - The FastAPI service primarily **verifies JWTs** (using `python-jose` or potentially helpers from `supabase-py`) to authorize requests.
    - For data interaction, FastAPI will often connect **directly to the PostgreSQL database** (e.g., using SQLAlchemy) for complex queries, analytics, and operations where its own logic dictates access.
    - `supabase-py` *might* be used for convenience for simpler interactions like basic storage access or auth utility functions, but it's not the primary data access method for the dedicated backend.

## 7. Known Issues & Troubleshooting

### 7.1. Supabase CLI on M1 Macs (`exec format error` / Studio Unhealthy) - RESOLVED

-   **Problem**: When running `npx supabase start` on M1 Macs, users might encounter `exec format error` for the `postgrest` container and an `unhealthy` status for the `supabase_studio` container. This prevents Supabase Studio from being accessible and can indicate issues with other Supabase services.
-   **Cause**: This is often due to Docker images used by the Supabase CLI not being fully compatible with the ARM64 architecture of M1 Macs, even with Rosetta 2 installed. Specific services like PostgREST or Supabase Studio might pull images that cause an `exec format error`.
-   **Attempted Solutions (as of 2025-05-07 for GHOSTLY+ Dashboard project)**:
    -   Multiple attempts with `npx supabase start` after ensuring Docker Desktop was running, disk space cleared, Rosetta 2 installed, Supabase CLI updated, and Docker system pruned.
    -   These attempts consistently failed with `exec format error` for `postgrest`.
-   **Resolution (2025-05-07)**:
    -   Switched to a manual Docker Compose setup for Supabase services.
    -   Cloned the official `supabase/supabase` repository to obtain their `docker/` configuration files.
    -   Copied `supabase/docker/*` files (specifically `docker-compose.yml` and others from the `docker` directory) to a project directory `supabase_config/`.
    -   Created a root `.env` file from `supabase/docker/.env.example` (obtained from the cloned repo) and populated it with necessary secrets and configurations (including `DOCKER_SOCKET_LOCATION=/var/run/docker.sock`).
    -   Ensured shell environment variables did not override the `.env` file by unsetting them for the session where necessary.
    -   Modified `supabase_config/docker-compose.yml` to add platform specification to the `rest` (PostgREST) service definition. Initially tried `platform: linux/arm64`, which still resulted in `postgrest` restarting. Successfully resolved by using `platform: linux/amd64`, forcing x86_64 emulation for `postgrest`.
    -   Successfully launched all Supabase services, including a stable `postgrest`, using `docker compose -f supabase_config/docker-compose.yml up -d` from the project root.
-   **Key Takeaway**: For M1 Mac users experiencing `exec format error` with `npx supabase start` for `postgrest`, a manual Docker Compose setup is a viable workaround. Explicitly setting `platform: linux/amd64` for the `postgrest` service in the `docker-compose.yml` can force successful emulation when native ARM64 or `platform: linux/arm64` fails. Ensure the root `.env` file is correctly configured and not overridden by shell environment variables.

-   **Next Steps / Potential Solutions (To Investigate Further)**:
    -   Reset Docker Desktop to factory settings (Caution: will remove all existing images/containers/volumes).
    -   Search for specific GitHub issues on Supabase CLI or related Docker image repositories regarding M1 `exec format error`.
    -   Investigate Docker Desktop settings on M1, particularly "Use Virtualization framework" and Rosetta emulation options.
    -   Consider manually defining Supabase services in the project's main `docker-compose.yml` using known ARM64-compatible images as an alternative to the Supabase CLI's local management, though this increases setup complexity.
    -   **Update (2025-05-07)**: A more targeted Perplexity search for GitHub issues or specific Docker Desktop M1 settings related to "exec format error" for PostgREST or "Supabase Studio unhealthy" did not immediately yield a definitive, simple fix. The issue appears rooted in Docker image compatibility on ARM64/M1 architecture. Further investigation into Docker Desktop settings (e.g., "Use Virtualization framework," ensuring "Use Rosetta for x86_64/amd64 emulation on Apple Silicon" is enabled) or deeper dives into Supabase GitHub issues threads are needed. 

## 8. Frontend Component Patterns

### 8.1. shadcn-vue Button Component Event Handling

When working with `shadcn-vue` Button components, especially those built upon `Primitive` from `reka-ui` (or similar primitive libraries), proper event handling is crucial. If click events (or other events) are not firing as expected, consider the following:

-   **Attribute & Event Forwarding (`v-bind="$attrs"`)**:
    -   Ensure that the custom Button component (e.g., `frontend/src/components/ui/button/Button.vue`) correctly forwards all attributes and event listeners to the underlying `Primitive` component.
    -   This is achieved by adding `v-bind="$attrs"` to the `<Primitive>` tag.
    -   **Example (`Button.vue`):**
        ```vue
        <template>
          <Primitive
            v-bind="$attrs"
            data-slot="button"
            :as="as"
            :as-child="asChild"
            :class="cn(buttonVariants({ variant, size }), props.class)"
          >
            <slot />
          </Primitive>
        </template>
        ```
    -   Without `v-bind="$attrs"`, Vue doesn't automatically inherit non-prop attributes (like event listeners) for custom components when there are multiple root nodes or when using render functions/scoped slots extensively, which can be the case with primitive-based components.

-   **Direct Click Handlers vs. Form Submission**:
    -   In forms, if a `Button` with `type="submit"` is not triggering the form's `@submit.prevent` handler as expected, or if click events on the button itself are being missed, switch to a direct click handler on the `Button`.
    -   Change the button's type from `submit` to `button`.
    -   Attach the event handler directly using `@click` on the `<Button>` component.
    -   Remove the `@submit.prevent` from the `<form>` tag if the button click now directly handles the intended action.
    -   **Example (`Auth.vue` - Sign In Button):**
        ```vue
        <form ...>
          <Button 
            type="button"
            @click="handleSignIn"
            ...
          >
            Sign In
          </Button>
        </form>
        ```

-   **Props Initialization (`asChild`)**:
    -   Ensure all props used by the `Primitive` component, such as `asChild`, are correctly initialized with default values in the custom `Button` component's script setup if they are not explicitly passed.
    -   **Example (`Button.vue`):**
        ```typescript
        const props = withDefaults(defineProps<Props>(), {
          as: 'button',
          asChild: false,
        })
        ```

-   **Server Restart**: After making changes to component logic or `.env` files, always restart the development server (e.g., Vite) to ensure all changes are loaded correctly.

**Reasoning**: Primitive-based components often rely on explicit attribute and event forwarding. Issues can arise if `$attrs` is not used, or if form submission mechanics interfere with the expected event flow of the custom button component. Direct event binding on the component instance, combined with correct prop initialization and attribute forwarding, ensures more reliable behavior.

### 8.2. Shadcn UI Vue Component Variant Styling with Tailwind 4

-   **Variant Detection Issue**: When using Shadcn UI Vue components with Tailwind 4, variant styling may not be properly detected, resulting in all buttons appearing black regardless of the specified variant.

-   **Potential Causes**:
    -   Tailwind 4's migration from HSL to OKLCH color format causes incompatibility with Shadcn UI's variant definitions
    -   Misconfigurations in the Tailwind setup for handling the new `@theme` directive
    -   Missing or misconfigured `data-slot` attributes required for proper styling
    -   Deprecated styles or components not updated for Tailwind 4's new syntax and color system

-   **Solution Approach**: (Task #27 created to address this)
    -   Update Tailwind configuration to properly support Shadcn UI Vue component variants
    -   Refactor component styling to use the latest recommended patterns for Tailwind 4
    -   Ensure proper conversion of HSL color definitions to OKLCH format
    -   Add appropriate `data-slot` attributes to component primitives
    -   Implement consistent theming that works correctly with both Shadcn UI Vue and Tailwind 4

-   **Example Fix Pattern**:
    ```vue
    <!-- Updated Button.vue with proper Tailwind 4 variant handling -->
    <script setup lang="ts">
    import { cva } from 'class-variance-authority'
    
    // Updated buttonVariants with proper Tailwind 4 color format
    const buttonVariants = cva(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      }
    )
    </script>
    
    <template>
      <Primitive
        v-bind="$attrs"
        data-slot="button"
        :as="as"
        :asChild="asChild"
        :class="cn(buttonVariants({ variant, size }), props.class)"
      >
        <slot />
      </Primitive>
    </template>
    ```

-   **Reference**: See Task #27 "Fix Shadcn UI Vue Variant Styling Issues with Tailwind 4" for detailed implementation steps.