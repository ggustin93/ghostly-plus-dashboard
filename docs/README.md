# GHOSTLY+ Documentation

> **Note:** The Memory Bank is the single source of truth for this project.

## Structure

```
docs/
├── 00_PROJECT_DEFINITION/    # Core requirements and scope
│   ├── prd.md               # Product Requirements Document
│   └── ...                  # Project specs, timeline, UX mockups
│
├── 01_ARCHITECTURE/          # System design
│   ├── architecture.md      # Core architecture overview
│   ├── data_flow.md         # Data flow diagrams and patterns
│   └── security.md          # Security implementation details
│
├── 02_SETUP_AND_DEVELOPMENT/ # Developer onboarding
│   ├── local_development_setup.md   # Local setup guide
│   ├── test_setup.md        # E2E testing approach
│   ├── developer_testing_guide.md   # MVP testing guide
│   ├── scripts/             # Setup and utility scripts
│   └── ...                  # Other setup guides
│
└── 03_GUIDES/               # Role-specific guides
    ├── api_reference.md     # API documentation
    └── integrations.md      # Integration guides
```

## Usage Guidelines

1. **Reference Only**: All documentation is for reference. Memory Bank remains the primary source of truth.

2. **Document Updates**: When updating the Memory Bank with significant changes, ensure relevant docs are also updated.

3. **Navigation**: The numbered structure provides a logical progression from project definition to specialized guides.

4. **Contributions**: When adding documentation:
   - Place in the appropriate section
   - Follow existing naming conventions
   - Update section READMEs as needed
   - Reference Memory Bank where applicable 