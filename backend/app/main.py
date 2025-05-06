from fastapi import FastAPI

app = FastAPI(
    title="GHOSTLY+ Dashboard API",
    description="API for the GHOSTLY+ Web Dashboard, managing patient data, EMG signals, and game metrics.",
    version="0.1.0",
)

@app.get("/health", tags=["Default"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok"}

# TODO: Add routers for different API modules (e.g., patients, sessions, emg_data)
# from .api import patients_router, sessions_router
# app.include_router(patients_router, prefix="/api/v1")
# app.include_router(sessions_router, prefix="/api/v1")

@app.get("/", tags=["Default"])
async def root():
    return {"message": "Welcome to the GHOSTLY+ Dashboard API"} 