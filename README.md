# Puppet Report Dashboard

Student Name: Venkata Pavan Kumar Utpala
Registration No: 23FE10CSE00388
Course: CSE3253 DevOps [PE6]
Semester: VI (2025-2026)
Project Type: Puppet Report Dashboard
Difficulty: Intermediate

---

## Project Overview

### Problem Statement
In large DevOps environments, Puppet agents run on dozens or hundreds of nodes. Without a centralised view, engineers must inspect individual Puppet run reports manually, making it very difficult to spot failed runs, unchanged nodes, or configuration drift. This project builds a Puppet Report Dashboard — a web application that ingests Puppet YAML/JSON run reports, stores them in a database, and presents a clear, real-time view of every node's Puppet run status, resource changes, and historical trends.

### Objectives
- [x] Build a Node.js/Express web application that receives and parses Puppet run reports
- [x] Display per-node Puppet run status (changed, unchanged, failed, skipped)
- [x] Show historical run trends and resource change counts per node
- [x] Containerise the application using Docker and orchestrate with Kubernetes
- [x] Implement a full CI/CD pipeline using Jenkins and GitHub Actions

### Key Features
- Puppet report receiver endpoint (`POST /api/reports`) accepting YAML/JSON reports
- Node summary table: last run time, status, changed/failed/skipped resource counts
- Per-node drill-down: full resource-by-resource breakdown of each run
- Historical run chart: pass/fail trend over time per node
- Active failure alerts with Email/Slack notifications
- REST API for external integrations

---

## Technology Stack

### Core Technologies
- Programming Language: Node.js / JavaScript
- Framework: Express.js
- Database: PostgreSQL

### DevOps Tools
- Version Control: Git
- CI/CD: Jenkins / GitHub Actions
- Containerization: Docker
- Orchestration: Kubernetes
- Configuration Management: Puppet
- Monitoring: Nagios / Prometheus

---

## Getting Started

### Prerequisites
- [ ] Docker Desktop v20.10+
- [ ] Git 2.30+
- [ ] Node.js 16+
- [ ] A Puppet master or Puppet agent generating reports
- [ ] PostgreSQL 13+ (or use Docker Compose)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/devops-project-puppet-report-dashboard.git
   cd devops-project-puppet-report-dashboard
   ```

2. Build and run using Docker:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Web Interface: http://localhost:8080
   - API: http://localhost:8080/api

### Puppet Agent Configuration
To forward Puppet reports to this dashboard, add the following to each node's `puppet.conf`:

```ini
[agent]
report      = true
reports     = http
reporturl   = http://<dashboard-host>:8080/api/reports
```

### Alternative Installation (Without Docker)
```bash
cd src/main
npm install
cp .env.example .env
# Edit .env with your config
npm start
```

---

## Project Structure

```
devops-project-puppet-report-dashboard/
│
├── README.md
├── .gitignore
├── LICENSE
│
├── src/
│   ├── main/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── config/
│   ├── test/
│   └── scripts/
│
├── docs/
│   ├── project-plan.md
│   ├── design-document.md
│   ├── user-guide.md
│   ├── api-documentation.md
│   └── screenshots/
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── kubernetes/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   ├── puppet/
│   └── terraform/
│
├── pipelines/
│   ├── Jenkinsfile
│   ├── .github/workflows/
│   │   └── ci-cd.yml
│   └── gitlab-ci.yml
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── selenium/
│   └── test-data/
│
├── monitoring/
│   ├── nagios/
│   ├── alerts/
│   └── dashboards/
│
├── presentations/
│   └── demo-script.md
│
└── deliverables/
    └── assessment/
```

---

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
APP_ENV=development
DB_HOST=localhost
DB_PORT=5432
API_KEY=your_api_key_here
NODE_ENV=development
PORT=8080
SLACK_WEBHOOK_URL=your_slack_webhook
ALERT_EMAIL=admin@example.com
PUPPET_REPORT_FORMAT=json
```

### Key Configuration Files
1. `src/main/config/config.yaml` - Application configuration
2. `docker-compose.yml` - Multi-container setup
3. `infrastructure/kubernetes/` - K8s deployment files

---

## CI/CD Pipeline

### Pipeline Stages
1. **Code Quality Check** - ESLint, Static Analysis
2. **Build** - npm build + Docker image build
3. **Test** - Unit and integration tests
4. **Security Scan** - Trivy vulnerability scanning
5. **Deploy to Staging** - Automatic deployment
6. **Deploy to Production** - Manual approval required

### Pipeline Status
![Pipeline Status](https://img.shields.io/badge/pipeline-passing-brightgreen)

---

## Testing

### Test Types
- Unit Tests: `npm test`
- Integration Tests: `npm run test:integration`
- E2E Tests: Selenium-based UI tests

### Test Coverage
```
-----------------------------|---------|----------|---------|
File                         | % Stmts | % Branch | % Lines |
-----------------------------|---------|----------|---------|
All files                    |   86.4  |   81.0   |   86.4  |
-----------------------------|---------|----------|---------|
```

---

## Monitoring & Logging

### Monitoring Setup
- Nagios: Configured for system monitoring
- Custom Metrics: Application-specific metrics
- Alerts: Email/Slack notifications for Puppet run failures

### Logging
- Structured JSON logging
- Log aggregation with ELK Stack (optional)
- Log retention: 30 days

---

## Docker & Kubernetes

### Docker Images
```bash
# Build image
docker build -t devops-project-puppet-report-dashboard:latest .

# Run container
docker run -p 8080:8080 devops-project-puppet-report-dashboard:latest
```

### Kubernetes Deployment
```bash
# Apply K8s manifests
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get pods,svc,deploy
```

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Build Time | < 5 min | ~3 min |
| Test Coverage | > 80% | 86.4% |
| Deployment Frequency | Daily | Daily |
| Mean Time to Recovery | < 1 hour | ~30 min |

---

## Documentation

### User Documentation
- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api-documentation.md)

### Technical Documentation
- [Design Document](docs/design-document.md)
- [Architecture Diagrams](docs/architecture/)

### DevOps Documentation
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

---

## Demo

### Demo Video
[Link to 5-10 minute demo video in deliverables/]

### Live Demo
URL: http://localhost:8080
Username: demo_user
Password: demo_pass_2024

---

## Development Workflow

### Git Branching Strategy
```
main
├── develop
│   ├── feature/report-receiver
│   ├── feature/node-drilldown
│   └── hotfix/urgent-fix
└── release/v1.0.0
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Test-related
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

---

## Security

### Security Measures Implemented
- [x] Input validation and sanitization
- [x] Authentication and authorization
- [x] Environment-based configuration
- [x] Regular dependency updates
- [x] Security headers in web applications

### Security Scanning
```bash
# Run security scan
trivy image devops-project-puppet-report-dashboard:latest
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Faculty Assessment

### Self-Assessment

| Criteria | Max Marks | Self Score | Remarks |
|----------|-----------|------------|---------|
| Implementation | 4 | [ ] | [Comments] |
| Documentation | 3 | [ ] | [Comments] |
| Innovation | 2 | [ ] | [Comments] |
| Presentation | 1 | [ ] | [Comments] |
| Total | 10 | [ ] | |

### Project Challenges
1. [Challenge 1 and solution]
2. [Challenge 2 and solution]
3. [Challenge 3 and solution]

### Learnings
- [Learning 1]
- [Learning 2]
- [Learning 3]
