# Demo Script - Puppet Report Dashboard

**Student:** Venkata Pavan Kumar Utpala | **Reg No:** 23FE10CSE00388
**Target Duration:** 7–8 minutes

---

## [0:00 – 0:30] Introduction
"Hello, I'm Venkata Pavan Kumar Utpala, reg number 23FE10CSE00388.
My project is a Puppet Report Dashboard — a Node.js web application that receives
Puppet run reports from managed nodes, stores them, and presents a real-time
view of node status, resource changes, and run history."

---

## [0:30 – 1:30] Repository Structure
- Show the GitHub repository
- Walk through: `src/` (server + routes + controllers), `infrastructure/` (docker/k8s/puppet/terraform), `pipelines/` (Jenkins + GitHub Actions), `tests/`, `monitoring/`, `docs/`

---

## [1:30 – 3:30] Live Application Demo
1. Open `http://localhost:8080`
2. Point out the **summary cards**: Total Nodes, Changed, Unchanged, Failed
3. Show the **Stacked Bar Chart** (7-day run trends) and **Doughnut chart**
4. Point out the **Node Status table** — each row is a Puppet-managed node
5. Point out the **Recent Reports table**
6. **Click a report row** — show the drill-down modal with resource-by-resource breakdown
7. Send a live test report via `curl`:
   ```bash
   curl -X POST http://localhost:8080/api/reports \
     -H "Content-Type: application/json" \
     -d @tests/test-data/sample-puppet-report.json
   ```
   Show the new node/report appearing on the dashboard.

---

## [3:30 – 4:30] Docker & Kubernetes
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
docker ps   # show 3 containers: app, db, nagios
```
- Show `infrastructure/docker/Dockerfile` (multi-stage, non-root user, healthcheck)
- Show `infrastructure/kubernetes/` — deployment.yaml, service.yaml, configmap.yaml

---

## [4:30 – 5:30] CI/CD Pipeline
- Open Jenkins → show pipeline stages: Checkout → Lint → Build → Test → Security Scan → Deploy
- Show `pipelines/.github/workflows/ci-cd.yml` in GitHub

---

## [5:30 – 6:30] Puppet Manifests
- Show `infrastructure/puppet/site.pp`
- Explain `puppet_report_dashboard` class (installs Node.js, manages service)
- Explain `puppet_agent_report_config` class (sets `reporturl` on managed nodes)

---

## [6:30 – 7:30] Testing & Monitoring
```bash
cd src/main && npm test   # show coverage > 80%
```
- Show `tests/selenium/ui_tests.py` — 7 UI tests including modal drill-down
- Show `monitoring/nagios/puppet-report-dashboard.cfg`
- Show `monitoring/alerts/alert-rules.yaml` — PuppetRunFailed, NodeUnreported alerts

---

## [7:30 – 8:00] Closing
"This project demonstrates the full DevOps lifecycle around Puppet configuration management —
from the report receiver API and real-time dashboard, through containerisation, CI/CD,
Kubernetes orchestration, and monitoring. Thank you."
