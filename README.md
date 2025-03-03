# LagomProject
Lagom (Swedish) – Striking the ideal balance; “just the right amount.”

# Warehouse Management System for Events

A lightweight web application designed to streamline **warehouse operations** for both **public and private events**. The main objectives are:

- Tracking **incoming and outgoing** inventory.  
- Generating **material lists** needed for each event.  
- Managing **event costs and revenues**.  
- Keeping a **history** of past events for quick reuse and reorganization.

## Features

1. **User Management**  
   - Create, update, and delete user accounts.  
   - Reset and recover passwords.  
   - Manage “spot” personnel for temporary event-related work.

2. **Warehouse Management**  
   - Material and product catalog (name, description, features).  
   - Categories for materials and products.  
   - Track product availability (check-in/check-out).  
   - Add manual notes for anomalies or defects.

3. **Event Management**  
   - Full event lifecycle: from creation to warehouse return.  
   - Attach images or layouts (e.g., floor plans, table arrangements).  
   - Event categorization (e.g., FOOD, RENT, TRADE FAIR BOOTH SETUP).  
   - Multiple event states (PARTITO/OUT, RIENTRATO/IN, SOLD/CASHED).  
   - Transfer materials between concurrent events.

4. **Material List Generation**  
   - Automatic generation of needed materials and tools.  
   - Manual updates at any stage.  
   - “Pick” rules (e.g., automatically select supplies based on menu categories).  
   - Special-case items (e.g., burger griddles) handled outside linear correlations.

## Technology Stack (Recommended)

- **Front-End**  
  - Angular (TypeScript), responsive layouts (Bootstrap/Tailwind).
- **Back-End**  
  - C# with .NET 8 LTS.  
  - Secure token-based auth (JWT), RBAC policies.
- **Database**  
  - Microsoft SQL Server (Azure SQL) with EntityFrameworkCore.
- **Cloud & Infrastructure**  
  - Azure Web App, Containers, Database.  
  - Monitoring & Logging (Azure Monitor, Application Insights).  
  - CI/CD pipelines (optional).
- **Security & Backup**  
  - Password hashing (salted).  
  - HTTPS for web traffic.  
  - Automated DB backups.

## Development Timeline

- **Project Start**: 03/03/2025  
- **v1.0 Release**: 01/06/2025  

### Sprint & Demo Milestones

1. **First Sprint** (finishes by 21/04/2025 - 27/04/2025)  
   - Demo 1: Basic features (warehouse catalogs, partial “pick” logic).
2. **Second Sprint** (finishes by 19/05/2025 - 25/05/2025)  
   - Demo 2: Advanced features integrated and final revisions.
3. **Bonus Week** (26/05/2025 - 01/06/2025)  
   - Internal testing, bug fixes, final release.

## Contact

- **Project Lead**: [Matteo Carelli](https://github.com/Teonirvana)  
- **Technical Lead**: [Moreno Bruschi](https://github.com/fathorMB) 

> **Note**: This summary is subject to change based on client feedback and evolving requirements.
