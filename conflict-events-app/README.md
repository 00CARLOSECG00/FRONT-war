# War Events Observatory

A comprehensive platform for analyzing global armed conflict data, powered by BigQuery and Power BI for advanced analytics and visualization.

## Architecture Overview

This application uses a modern data architecture designed for cost-effective analysis of large conflict datasets:

- **BigQuery**: Primary data warehouse for fast analytical queries
- **Power BI**: Interactive dashboards and advanced visualizations
- **PostgreSQL + PostGIS**: Real-time map data and geospatial operations
- **Next.js**: Frontend application with embedded Power BI reports

## Environment Setup

### Required Environment Variables

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Power BI Configuration
NEXT_PUBLIC_POWERBI_TENANT_ID=your-tenant-id-here
NEXT_PUBLIC_POWERBI_TIMELINE_REPORT_ID=your-timeline-report-id
NEXT_PUBLIC_POWERBI_REGIONS_REPORT_ID=your-regions-report-id
NEXT_PUBLIC_POWERBI_ACTORS_REPORT_ID=your-actors-report-id
NEXT_PUBLIC_POWERBI_CASUALTIES_REPORT_ID=your-casualties-report-id
\`\`\`

### Power BI Setup

1. **Create Power BI Workspace**: Set up a dedicated workspace for conflict data reports
2. **Connect to BigQuery**: Configure Power BI to connect to your BigQuery dataset
3. **Create Reports**: Build the following reports:
   - Timeline Analysis (events, deaths, trends over time)
   - Regional Breakdown (geographic distribution)
   - Conflict Actors Analysis (actor relationships and involvement)
   - Casualty Analysis (detailed casualty breakdowns)
4. **Publish Reports**: Publish reports to Power BI Service and note the report IDs
5. **Configure Embedding**: Enable embedding for each report and configure security settings

### BigQuery Configuration

The BigQuery dataset should contain the following tables:
- `conflict_events`: Main events table with all conflict data
- `lookups_countries`: Country reference data
- `lookups_regions`: Regional classifications
- `lookups_actors`: Conflict actor information

## Key Features

- **Interactive Map**: Leaflet-based map with clustering and heat layers
- **Power BI Dashboards**: Embedded analytical dashboards for deep insights
- **Advanced Filtering**: Comprehensive filters for temporal, geographic, and thematic analysis
- **Responsive Design**: Mobile-friendly interface with dark theme
- **Ethical Framework**: Built-in disclaimers and responsible use guidelines

## Cost Optimization

This architecture is designed to minimize BigQuery costs:
- Power BI caches query results, reducing repeated BigQuery calls
- Scheduled refresh instead of real-time queries
- Optimized queries using partitioned and clustered tables
- Frontend map uses PostgreSQL for real-time interactions

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`.

## Deployment

This application is optimized for deployment on Vercel with the following integrations:
- Vercel Postgres (for map data)
- External BigQuery connection (via Power BI)
- Power BI Service (for embedded reports)

## Ethical Considerations

This platform handles sensitive conflict data. Please review the ethical framework in the About page and ensure responsible use of the data and visualizations.
