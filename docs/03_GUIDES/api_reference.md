# API Endpoints

> **Note**: This documentation is a work in progress and may be updated with additional information and examples.

For comprehensive API documentation, please refer to:

1. **Memory Bank**: [systemPatterns.md](../../../memory-bank/systemPatterns.md) - Contains the latest architectural decisions and backend implementation strategy
2. **FastAPI Documentation**: Once running, the FastAPI backend provides live OpenAPI documentation at `/api/docs` and `/api/redoc`

## Key Endpoints Summary

The system uses a hybrid architecture with endpoints provided by:

- **Supabase Auth**: Authentication endpoints (`/auth/v1/*`)
- **FastAPI Backend**: Business logic, C3D processing, EMG analysis (`/api/*`)
- **Next.js Route Handlers**: Frontend-specific APIs (`/app/api/*`)

For detailed implementation guidance, see the **"Backend Implementation Strategy"** section in [systemPatterns.md](../../../memory-bank/systemPatterns.md).