# Terraform Configuration - Puppet Report Dashboard Infrastructure
# CSE3253 DevOps | Venkata Pavan Kumar Utpala | 23FE10CSE00388

terraform {
  required_version = ">= 1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "puppet-report-dashboard-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
  tags = { Name = "puppet-report-dashboard-public" }
}

resource "aws_security_group" "app_sg" {
  name   = "puppet-report-dashboard-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "Dashboard UI + Puppet reporturl"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "puppet-report-dashboard-sg" }
}

resource "aws_instance" "app" {
  ami                    = var.ami_id
  instance_type          = "t3.medium"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  key_name               = var.key_pair_name

  user_data = <<-EOF
    #!/bin/bash
    curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
    docker pull devops-project-puppet-report-dashboard:latest
    docker run -d -p 8080:8080 devops-project-puppet-report-dashboard:latest
  EOF

  tags = { Name = "puppet-report-dashboard-ec2" }
}

output "app_public_ip" {
  description = "Public IP — configure Puppet agents to use this as reporturl host"
  value       = aws_instance.app.public_ip
}
