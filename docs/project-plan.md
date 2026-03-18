# Project Plan - Puppet Report Dashboard

**Student:** Venkata Pavan Kumar Utpala | **Reg No:** 23FE10CSE00388
**Course:** CSE3253 DevOps [PE6] | Semester VI (2025-2026)

---

## Project Timeline

| Week | Tasks | Status |
|------|-------|--------|
| Week 1  | Requirements gathering, repo setup, project structure | ✅ Done |
| Week 2  | Core Node.js server + report receiver endpoint (POST /api/reports) | ✅ Done |
| Week 3  | Report parsing (JSON/YAML), per-node aggregation logic | ✅ Done |
| Week 4  | Dashboard UI (HTML/CSS/Chart.js) with node table and drilldown modal | ✅ Done |
| Week 5  | Docker & docker-compose setup | ✅ Done |
| Week 6  | Kubernetes manifests (deployment, service, configmap) | ✅ Done |
| Week 7  | Jenkins CI/CD pipeline + GitHub Actions | ✅ Done |
| Week 8  | Nagios monitoring configuration + alert rules | ✅ Done |
| Week 9  | Unit, integration, and Selenium tests | ✅ Done |
| Week 10 | Puppet manifests, final documentation, demo video | 🔄 In Progress |

---

## Milestones

1. **M1 – Report Receiver** (Week 3): API accepts and stores Puppet run reports
2. **M2 – Working Dashboard** (Week 4): UI displays node statuses and trends
3. **M3 – Containerised** (Week 5): Docker image and compose running
4. **M4 – CI/CD Live** (Week 7): Full pipeline passing in Jenkins
5. **M5 – Final Delivery** (Week 10): Demo video + report submitted

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| No live Puppet master available | Medium | High | Use sample JSON report files for testing |
| Kubernetes cluster unavailable | Medium | High | Use Minikube for local testing |
| Selenium test flakiness | Medium | Low | Add explicit WebDriverWait conditions |
