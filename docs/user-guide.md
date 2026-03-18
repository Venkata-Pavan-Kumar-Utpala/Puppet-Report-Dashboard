# User Guide - Puppet Report Dashboard

**Student:** Venkata Pavan Kumar Utpala | **Reg No:** 23FE10CSE00388

---

## 1. Launch the Application

```bash
docker-compose -f infrastructure/docker/docker-compose.yml up --build
# Dashboard: http://localhost:8080
```

---

## 2. Connect Your Puppet Agents

Add the following to each node's `/etc/puppetlabs/puppet/puppet.conf`:

```ini
[agent]
report    = true
reports   = http
reporturl = http://<your-dashboard-host>:8080/api/reports
```

After the next Puppet run, the node will appear on the dashboard automatically.

---

## 3. Dashboard Walkthrough

**Summary Cards (top row)**
| Card | Meaning |
|------|---------|
| Total Nodes | How many unique nodes have submitted reports |
| Changed | Nodes whose last run made configuration changes |
| Unchanged | Nodes whose last run made no changes (fully converged) |
| Failed | Nodes whose last run encountered an error |
| Reports Today | Total reports received today |
| Failures Today | Failed runs received today |

**Run Trends Chart** — Stacked bar chart showing changed / unchanged / failed counts per day over the last 7 days.

**Status Breakdown** — Doughnut chart of current node statuses.

**Node Status Table** — One row per node. Shows last run time, status badge, and resource counts.

**Recent Reports Table** — The 20 most recent reports. Click any row to open the **drill-down modal** showing a resource-by-resource breakdown of that run.

---

## 4. Manually Sending a Test Report

```bash
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -d @tests/test-data/sample-puppet-report.json
```

---

## 5. Troubleshooting

| Issue | Solution |
|-------|----------|
| Node not appearing on dashboard | Check that `reporturl` is set correctly in puppet.conf and the agent has run at least once |
| Dashboard cards show `--` | Wait 30 seconds for the first data poll |
| `POST /api/reports` returns 400 | Ensure the report JSON includes `host` and `status` fields |
| Docker containers not starting | Run `docker-compose logs` to check errors |
