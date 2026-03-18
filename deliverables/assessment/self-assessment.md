# Self-Assessment - Puppet Report Dashboard

**Student:** Venkata Pavan Kumar Utpala
**Reg No:** 23FE10CSE00388
**Course:** CSE3253 DevOps [PE6] | Semester VI (2025-2026)

---

## Assessment Checklist

### Repository Structure (1 mark)
- [x] Proper folder structure following template
- [x] All required directories present: src/, docs/, infrastructure/, pipelines/, tests/, monitoring/, presentations/, deliverables/
- [x] Clear organisation and meaningful file names

### Code Quality (2 marks)
- [x] Clean, readable Node.js code with consistent style
- [x] JSDoc comments on all controllers and route files
- [x] Follows ESLint coding standards
- [x] Input validation and error handling on all endpoints (400, 404, 500)

### Documentation (3 marks)
- [x] Comprehensive README.md with setup instructions and Puppet agent config guide
- [x] Technical design document with architecture diagram and DB schema
- [x] User guide with dashboard walkthrough and troubleshooting
- [x] Full API documentation for all endpoints
- [x] Project plan with weekly timeline and risk register

### DevOps Implementation (3 marks)
- [x] CI/CD pipeline: Jenkins + GitHub Actions + GitLab CI
- [x] Containerisation: multi-stage Dockerfile + docker-compose (app + postgres + nagios)
- [x] Kubernetes: deployment.yaml, service.yaml, configmap.yaml with health probes
- [x] Puppet: site.pp with `puppet_report_dashboard` and `puppet_agent_report_config` classes
- [x] Terraform: AWS EC2 + VPC infrastructure
- [x] Nagios monitoring config + alert rules YAML

### Presentation (1 mark)
- [x] Demo script prepared with 8-minute timed walkthrough
- [ ] Demo video recorded (deliverables/demo-video.mp4)

---

## Self-Score

| Criteria | Max Marks | Self Score | Remarks |
|----------|-----------|------------|---------|
| Implementation | 4 | 4 | Full report receiver + dashboard + all DevOps tools |
| Documentation | 3 | 3 | All 5 required doc files, detailed and accurate |
| Innovation | 2 | 2 | Drill-down modal, YAML+JSON report ingestion, Puppet agent auto-config class |
| Presentation | 1 | 0.5 | Demo script complete; video pending |
| **Total** | **10** | **9.5** | |

---

## Project Challenges

1. **YAML report parsing** — Puppet agents can POST reports in YAML format, but Express parses JSON by default. Solved by adding `express.text()` middleware for `application/x-yaml` and calling `js-yaml.load()` on the raw body.
2. **Per-node aggregation** — Deriving a single "current status" per node from multiple report records required sorting by `run_time` and picking the most recent. Solved in `nodesController.js`.
3. **Kubernetes namespace not pre-existing** — `kubectl apply` failed because the `devops` namespace was missing. Fixed by adding `kubectl create namespace devops --dry-run=client -o yaml | kubectl apply -f -` to the deploy stage.

## Learnings
- How Puppet agents communicate run results via HTTP `reporturl`
- How to build a report ingestion API that accepts both JSON and YAML formats
- How Kubernetes liveness and readiness probes prevent bad deployments reaching production
- How multi-stage Docker builds reduce image size by excluding dev dependencies
- How Puppet manifests can configure both the dashboard server and the reporting agents
