# Puppet Manifest — Puppet Report Dashboard Node Setup
# CSE3253 DevOps | Venkata Pavan Kumar Utpala | 23FE10CSE00388
#
# This manifest provisions the server that RUNS the dashboard app.
# Separately, Puppet agents on managed nodes are configured to POST
# their run reports to this server's /api/reports endpoint.

class puppet_report_dashboard {

  # ── Node.js ──────────────────────────────────────────────────────────────
  exec { 'add-nodejs-repo':
    command => 'curl -fsSL https://deb.nodesource.com/setup_18.x | bash -',
    path    => ['/usr/bin', '/bin'],
    unless  => 'which node',
  }

  package { 'nodejs':
    ensure  => present,
    require => Exec['add-nodejs-repo'],
  }

  # ── App Directory ─────────────────────────────────────────────────────────
  file { '/opt/puppet-report-dashboard':
    ensure => directory,
    owner  => 'appuser',
    group  => 'appuser',
    mode   => '0755',
  }

  file { '/opt/puppet-report-dashboard/logs':
    ensure  => directory,
    owner   => 'appuser',
    group   => 'appuser',
    mode    => '0755',
    require => File['/opt/puppet-report-dashboard'],
  }

  # ── Systemd Service ───────────────────────────────────────────────────────
  file { '/etc/systemd/system/puppet-report-dashboard.service':
    ensure  => file,
    content => @("EOF"),
      [Unit]
      Description=Puppet Report Dashboard
      After=network.target

      [Service]
      Type=simple
      User=appuser
      WorkingDirectory=/opt/puppet-report-dashboard
      ExecStart=/usr/bin/node server.js
      Restart=on-failure
      Environment=NODE_ENV=production
      Environment=PORT=8080

      [Install]
      WantedBy=multi-user.target
      | EOF
    notify  => Service['puppet-report-dashboard'],
  }

  service { 'puppet-report-dashboard':
    ensure  => running,
    enable  => true,
    require => [
      Package['nodejs'],
      File['/etc/systemd/system/puppet-report-dashboard.service'],
    ],
  }

  # ── Firewall ──────────────────────────────────────────────────────────────
  firewall { '100 allow puppet report dashboard':
    dport  => 8080,
    proto  => 'tcp',
    action => 'accept',
  }
}

# ── Puppet Agent Report Forwarding ────────────────────────────────────────────
# Apply this class to every managed node to forward Puppet reports to the dashboard
class puppet_agent_report_config (
  String $dashboard_host = 'puppet-report-dashboard.example.com',
  Integer $dashboard_port = 8080,
) {
  ini_setting { 'puppet report enabled':
    ensure  => present,
    path    => '/etc/puppetlabs/puppet/puppet.conf',
    section => 'agent',
    setting => 'report',
    value   => 'true',
  }

  ini_setting { 'puppet reports http':
    ensure  => present,
    path    => '/etc/puppetlabs/puppet/puppet.conf',
    section => 'agent',
    setting => 'reports',
    value   => 'http',
  }

  ini_setting { 'puppet reporturl':
    ensure  => present,
    path    => '/etc/puppetlabs/puppet/puppet.conf',
    section => 'agent',
    setting => 'reporturl',
    value   => "http://${dashboard_host}:${dashboard_port}/api/reports",
  }
}

include puppet_report_dashboard
