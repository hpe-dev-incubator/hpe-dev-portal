---
title: Streamlining Server Management - Bulk Onboarding to HPE Compute Ops Management with iLOrest
date: 2025-12-22T14:33:05.807Z
priority: 9
author: Rajeev Kallur
authorimage: /img/Avatar2.svg
disable: false
tags: 
  - ComputeOpsManagement
  - iLOrest
  - ServerManagement
  - HPE
  - CloudManagement
  - Automation
  - HPEDev
featuredBlog: true

---

# Streamlining Server Management: Bulk Onboarding to HPE Compute Ops Management with iLOrest

## Introduction

Managing hundreds or thousands of servers manually is time-consuming and error-prone. IT administrators often face the challenge of onboarding multiple HPE servers to HPE Compute Ops Management (COM) efficiently. In this tutorial, we'll explore how the iLOrest command-line interface simplifies this process through its powerful bulk onboarding feature, allowing you to onboard dozens or even hundreds of servers with a single command.

**What You'll Learn:**
- How to configure multiple servers for COM onboarding using a JSON configuration file
- How to perform pre-checks to validate your configuration before making changes
- How to execute bulk onboarding operations with proper error handling
- Best practices for managing large-scale server deployments

**Prerequisites:**
- iLOrest installed on your management workstation ([Installation Guide](https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/installation))
- HPE Compute Ops Management activation key or workspace ID
- Network access to target iLO interfaces
- iLO administrator credentials
- HPE iLO 5 version 2.30 or later on target servers

## Understanding HPE Compute Ops Management

HPE Compute Ops Management (COM) is a cloud-based infrastructure management platform that provides:
- Centralized server monitoring and management
- Firmware and driver updates
- Security compliance monitoring
- Health and performance analytics
- Automated incident detection and response

Before servers can be managed through COM, they must be "onboarded" - a process that establishes a secure connection between the server's iLO and the COM platform.

## The Challenge: Manual vs. Bulk Onboarding

### Traditional Manual Approach
Onboarding servers one at a time requires:
1. Logging into each iLO interface individually
2. Configuring network settings (DNS, NTP, proxy)
3. Entering the COM activation key
4. Waiting for connection establishment
5. Verifying the connection status

For 100 servers, this could take hours or even days!

### The iLOrest Bulk Onboarding Solution
With iLOrest's `computeopsmanagement multiconnect` command, you can:
- Onboard multiple servers simultaneously using a single JSON configuration file
- Define both individual servers and IP ranges
- Apply common settings across all servers with per-server overrides
- Perform pre-checks before making any changes
- Generate detailed reports of successes and failures

## Tutorial: Bulk Onboarding Servers to COM

### Step 1: Generate the Configuration Template

First, let's generate a template configuration file that you can customize:

```powershell
ilorest computeopsmanagement multiconnect --input_file_json_template
```

![Generate Template Command](generate_template.png)

This creates a file named `multiconnect_input_template.json` with the following structure:

```json
{
    "commonSettings": {
        "computeOpsManagement": {
            "activationKey": "ACTIVATION-KEY-XXXX-YYYY-ZZZZ",
            "workspace_id": "WORKSPACE-ID-PLACEHOLDER-12345"
        },
        "iloAuthentication": {
            "iloUser": "GENERIC_ADMIN_USER",
            "iloPassword": "GENERIC_SECURE_PASSWORD"
        },
        "network": {
            "dns": ["203.0.113.10", "203.0.113.11"],
            "ntp": ["198.51.100.50", "198.51.100.51"]
        },
        "proxy": {
            "server": "proxy.example.net",
            "port": 8080,
            "credentials": {
                "username": "PROXY_USER",
                "password": "PROXY_PASSWORD"
            }
        }
    },
    "targets": {
        "ilos": {
            "individual": [
                {"ip": "192.0.2.10"},
                {"ip": "192.0.2.11", "network": {"dns": ["203.0.113.20", "203.0.113.21"]}},
                {"ip": "192.0.2.12", "skipProxy": true}
            ],
            "ranges": [
                {"start": "192.0.2.100", "end": "192.0.2.110"},
                {"start": "192.0.2.120", "end": "192.0.2.125", "skipNtp": true}
            ]
        }
    }
}
```

### Step 2: Customize Your Configuration

#### 2.1 Common Settings Section

The `commonSettings` section defines default values applied to all servers:

**COM Credentials:**
```json
{
    "computeOpsManagement": {
        "activationKey": "YOUR-ACTUAL-ACTIVATION-KEY",
        "workspace_id": "YOUR-WORKSPACE-ID"
    }
}
```
Get these from your HPE Compute Ops Management portal at [https://common.cloud.hpe.com](https://common.cloud.hpe.com).

**iLO Authentication:**
```json
{
    "iloAuthentication": {
        "iloUser": "administrator",
        "iloPassword": "YourSecurePassword123!"
    }
}
```
Use credentials that have administrator privileges on all target iLOs.

**Network Configuration:**
```json
{
    "network": {
        "dns": ["10.0.1.10", "10.0.1.11"],
        "ntp": ["time.example.com", "time2.example.com"]
    }
}
```
Configure DNS and NTP servers appropriate for your environment.

**Proxy Settings (Optional):**
```json
{
    "proxy": {
        "server": "proxy.mycompany.com",
        "port": 8080,
        "credentials": {
            "username": "proxyuser",
            "password": "ProxyPass123"
        }
    }
}
```
If your servers require proxy to reach the internet, configure these settings. Otherwise, remove this section.

#### 2.2 Target Servers Section

Define your target servers in two ways:

**Individual Servers:**
```json
{
    "individual": [
        {"ip": "10.20.30.40"},
        {"ip": "10.20.30.41", "network": {"dns": ["8.8.8.8", "8.8.4.4"]}},
        {"ip": "10.20.30.42", "skipNtp": true, "skipProxy": true}
    ]
}
```

**IP Ranges:**
```json
{
    "ranges": [
        {"start": "10.20.30.50", "end": "10.20.30.60"},
        {"start": "10.20.40.1", "end": "10.20.40.20", "skipDns": true}
    ]
}
```

**Override Options:**
- `skipDns`: Skip DNS configuration for this server
- `skipNtp`: Skip NTP configuration for this server
- `skipProxy`: Skip proxy configuration for this server
- `network`: Override network settings for specific servers

### Step 3: Validate Configuration with Pre-check

Before onboarding, run a pre-check to validate your configuration:

```powershell
ilorest computeopsmanagement multiconnect --input_file bulk_com_input.json --precheck
```

### Step 3: Precheck before Onboarding

The pre-check validates:
- ✓ Network connectivity to each iLO
- ✓ iLO credentials are valid
- ✓ iLO firmware version supports COM
- ✓ Server model compatibility
- ✓ Activation key and workspace ID format
- ✓ Current COM connection status
- ✓ Proxy configuration (if applicable)

**Example Pre-check Output:**
```
ilorest computeopsmanagement multiconnect --input_file servers_input.json --output report.json --precheck
Validating 192.168.254.15: 5/5 [########################################] 100.0%[status=PASSED, preCheckPassed=5]
Precheck completed. Report saved to: report.json
Precheck passed for 5 iLO(s).
Precheck failed for 0 iLO(s).
```

Check the precheck report for detailed analysis:

### Step 4: Execute Bulk Onboarding

Once the pre-check passes, execute the bulk onboarding:

```powershell
ilorest computeopsmanagement multiconnect --input_file servers_input.json
```

**What Happens During Onboarding:**

1. **Connection Phase**: iLOrest connects to each iLO serially. Efforts are underway to make this onboarding parallel.
2. **Network Configuration**: DNS and NTP settings are applied
3. **Proxy Setup**: Proxy configuration is applied (if specified)
4. **COM Registration**: Activation key and workspace ID are submitted
5. **Verification**: Connection status is verified

**Example Onboarding Output:**
```
ilorest computeopsmanagement multiconnect --input_file servers_input.json --output report.json
Processing 192.168.254.15: 5/5 [########################################] 100.0%[status=SUCCESS, connected=5]
ComputeOpsManagement connection successful for 5 server(s).
ComputeOpsManagement connection failed for 0 server(s).
The operation completed. Details available in the output report.json file
```

### Step 5: Handling iLO Resets

Some servers may require an iLO reset for settings to take effect. You can allow automatic resets:

```powershell
ilorest computeopsmanagement multiconnect --input_file servers_input.json --allow_ilo_reset
```

**Important Notes:**
- iLO reset temporarily interrupts management connectivity (30-60 seconds)
- The iLO reset does NOT affect the running operating system
- After reset, the iLO will automatically reconnect to COM

### Step 6: Verify Onboarding Status

You can verify from the HPE Compute Ops Management console:

1. Log in to [HPE Compute Ops Management](https://common.cloud.hpe.com)
2. Navigate to **Devices** > **Servers**
3. Confirm your newly onboarded servers appear in the inventory

## Advanced Configuration Examples

### Example 1: Mixed Environment with Different Network Settings

```json
{
    "commonSettings": {
        "computeOpsManagement": {
            "activationKey": "ABC123-XYZ789-DEF456",
            "workspace_id": "ws-production-001"
        },
        "iloAuthentication": {
            "iloUser": "administrator",
            "iloPassword": "SecurePass123!"
        },
        "network": {
            "dns": ["10.0.1.10", "10.0.1.11"],
            "ntp": ["ntp1.corp.com", "ntp2.corp.com"]
        }
    },
    "targets": {
        "ilos": {
            "individual": [
                {
                    "ip": "10.10.1.50",
                    "comment": "DMZ server - different DNS",
                    "network": {
                        "dns": ["10.50.1.10", "10.50.1.11"]
                    }
                },
                {
                    "ip": "10.10.2.100",
                    "comment": "Test server - skip all network config",
                    "skipDns": true,
                    "skipNtp": true
                }
            ],
            "ranges": [
                {
                    "start": "10.10.1.10",
                    "end": "10.10.1.40",
                    "comment": "Production rack 1"
                }
            ]
        }
    }
}
```

### Example 2: Environment with Corporate Proxy

```json
{
    "commonSettings": {
        "computeOpsManagement": {
            "activationKey": "ABC123-XYZ789-DEF456",
            "workspace_id": "ws-production-001"
        },
        "iloAuthentication": {
            "iloUser": "administrator",
            "iloPassword": "SecurePass123!"
        },
        "network": {
            "dns": ["10.0.1.10", "10.0.1.11"],
            "ntp": ["ntp.corp.com"]
        },
        "proxy": {
            "server": "proxy.corp.com",
            "port": 8080,
            "credentials": {
                "username": "svc_ilo_proxy",
                "password": "ProxyPassword123"
            }
        }
    },
    "targets": {
        "ilos": {
            "ranges": [
                {
                    "start": "10.10.1.10",
                    "end": "10.10.1.100",
                    "comment": "Datacenter A - all servers use proxy"
                },
                {
                    "start": "10.20.1.10",
                    "end": "10.20.1.50",
                    "comment": "DMZ servers - direct internet access",
                    "skipProxy": true
                }
            ]
        }
    }
}
```

### Example 3: Large-Scale Deployment (500+ Servers)

For very large deployments, you can programmatically generate the configuration:

```python
import json

# Generate configuration for 500 servers across 5 subnets
config = {
    "commonSettings": {
        "computeOpsManagement": {
            "activationKey": "YOUR-KEY",
            "workspace_id": "YOUR-WORKSPACE"
        },
        "iloAuthentication": {
            "iloUser": "administrator",
            "iloPassword": "YourPassword"
        },
        "network": {
            "dns": ["10.0.1.10", "10.0.1.11"],
            "ntp": ["ntp.corp.com"]
        }
    },
    "targets": {
        "ilos": {
            "ranges": []
        }
    }
}

# Generate ranges for 5 subnets, 100 servers each
for subnet in range(10, 15):
    config["targets"]["ilos"]["ranges"].append({
        "start": f"10.{subnet}.1.10",
        "end": f"10.{subnet}.1.110",
        "comment": f"Datacenter subnet {subnet}"
    })

# Save configuration
with open("large_deployment.json", "w") as f:
    json.dump(config, f, indent=4)

print("Configuration generated for 500 servers")
```

Then execute:
```powershell
# Run precheck first
ilorest computeopsmanagement multiconnect --input_file large_deployment.json --precheck --output large_precheck.json

# Review the precheck report, then onboard
ilorest computeopsmanagement multiconnect --input_file large_deployment.json --allow_ilo_reset --output large_onboard.json
```

## Troubleshooting Common Issues

### Issue 1: Authentication Failures

**Symptom:** `[ERROR] Authentication failed` for multiple servers

**Solutions:**
- Verify iLO credentials are correct
- Ensure the account has administrator privileges
- Check if accounts are locked due to failed login attempts
- Verify iLO user directory configuration if using AD/LDAP

### Issue 2: Network Connectivity Problems

**Symptom:** `[ERROR] Connection timeout` or `Unable to reach iLO`

**Solutions:**
- Verify network connectivity: `ping 10.20.30.40`
- Check firewall rules allow HTTPS (port 443) to iLO
- Verify iLO IP addresses are correct
- Ensure management network routing is configured

### Issue 3: Firmware Version Too Old

**Symptom:** `This iLO version doesn't support the requested operation. Please update iLO firmware`

**Solutions:**
- Update iLO firmware to version 2.30 or later
- Use iLOrest firmware update command:
  ```powershell
  ilorest firmwareupdate --url 10.20.30.40 -u admin -p password --component ilo5_xxx.bin
  ```
- Deploy firmware updates at scale using HPE OneView or SUM

### Issue 4: Invalid Activation Key or Workspace ID

**Symptom:** `The activation key provided is invalid. Please check and enter a valid one`

**Solutions:**
- Verify activation key in COM portal
- Ensure workspace ID is correct
- Check activation key hasn't expired
- Confirm you have permissions in the workspace

### Issue 5: Proxy Configuration Issues

**Symptom:** `iLO couldn't reach the endpoint. Check your proxy or firewall settings` with proxy configured

**Solutions:**
- Verify proxy server address and port
- Test proxy connectivity
- Check proxy credentials if authentication is required
- Verify proxy allows HTTPS traffic to HPE cloud services
- Try bypassing proxy for specific servers using `"skipProxy": true`

## Best Practices

### 1. Always Run Pre-checks First
Pre-checks help identify issues before making changes:
```powershell
ilorest computeopsmanagement multiconnect --input_file server_input.json --precheck --output precheck_report.json
```
Review the report and fix issues before proceeding.

### 2. Use Staged Rollouts
For large deployments, onboard in phases:
- **Phase 1**: 5-10 test servers
- **Phase 2**: One complete rack or subnet
- **Phase 3**: Remaining servers in batches

### 3. Maintain Configuration Files
Store configuration files in version control:
```powershell
git add server_input.json
git commit -m "Add COM onboarding config for production servers"
git push
```

### 4. Generate and Archive Reports
Always save reports for audit trail:
```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
ilorest computeopsmanagement multiconnect --input_file server_input.json --output "onboard_$timestamp.json"
```

### 5. Secure Credential Management
Never commit passwords to version control. Use environment variables or secure vaults:

**PowerShell Example:**
```powershell
$password = Read-Host -AsSecureString "Enter iLO Password"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Update JSON with password
$config = Get-Content config.json | ConvertFrom-Json
$config.commonSettings.iloAuthentication.iloPassword = $plainPassword
$config | ConvertTo-Json -Depth 10 | Out-File config_with_creds.json

# Execute onboarding
ilorest computeopsmanagement multiconnect --input_file config_with_creds.json

# Remove file with credentials
Remove-Item config_with_creds.json -Force
```

### 6. Monitor Progress in Real-Time
For large operations, monitor the output file:
```powershell
# In one terminal, run onboarding
ilorest computeopsmanagement multiconnect --input_file config.json --output live_report.json

# In another terminal, watch progress
while ($true) {
    Clear-Host
    Get-Content live_report.json | ConvertFrom-Json | Format-Table -Property ip, onboardStatus, onboardError
    Start-Sleep -Seconds 5
}
```

## Performance Considerations

Actual time depends on:
- Network latency
- iLO responsiveness
- Number of configuration changes
- Whether iLO resets are required

### Network Bandwidth
Bulk operations generate minimal network traffic:
- Configuration changes: ~1-2 KB per server
- Status checks: ~500 bytes per server
- Total bandwidth: Typically less than 1 Mbps for 100 servers

## Security Considerations

### 1. Credential Protection
- Store activation keys in secure vaults (Azure Key Vault, HashiCorp Vault)
- Use environment variables instead of hardcoding credentials
- Implement least-privilege access for iLO accounts
- Rotate passwords regularly

### 2. Network Security
- Use secure management networks (isolated VLANs)
- Implement firewall rules limiting iLO access
- Consider VPN for remote management
- Enable iLO security features (FIPS mode, TLS 1.2+)

### 3. Audit Trail
- Maintain logs of all onboarding operations
- Archive configuration files and reports
- Track who performed operations and when
- Implement approval workflows for production changes

### 4. COM Access Control
- Use role-based access control in COM
- Separate workspaces for different environments (dev/test/prod)
- Review COM user permissions regularly
- Enable multi-factor authentication

## Conclusion

Bulk onboarding to HPE Compute Ops Management using iLOrest transforms a tedious, error-prone manual process into an efficient, automated operation. By following this tutorial, you can:

- ✅ Ensure consistent configuration across your entire fleet
- ✅ Validate configurations before making changes
- ✅ Generate comprehensive audit reports
- ✅ Scale your server management operations with ease

The `computeopsmanagement multiconnect` command is a powerful addition to the iLOrest toolkit, enabling IT administrators to manage HPE infrastructure at scale with confidence.

## Call to Action

Ready to streamline your server management?

### Get Started Today:
1. **Install iLOrest**: Download from [HPE Support](https://support.hpe.com) or install via pip:
   ```powershell
   pip install ilorest
   ```

2. **Try the Tutorial**: Follow the steps in this guide with a small test environment

3. **Join the Community**: 
   - Visit [HPE Developer Community](https://developer.hpe.com)
   - Explore [iLOrest GitHub Repository](https://github.com/HewlettPackard/python-redfish-utility)
   - Read more tutorials at [HPE DEV Blog](https://developer.hpe.com/blog)

### Additional Resources:
- **iLOrest Documentation**: [User Guide](https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide)
- **HPE iLO RESTful API**: [Reference](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo7)
- **Video Tutorials**: [HPE YouTube Channel](https://www.youtube.com/user/HewlettPackardVideos)

### Need Help?
- **Technical Support**: [HPE Support Center](https://support.hpe.com)
- **Community Forums**: [HPE Community](https://community.hpe.com)
- **GitHub Issues**: [Report bugs or request features](https://github.com/HewlettPackard/python-redfish-utility/issues)

---

*This blog post was created for the HPE Developer Community. iLOrest is part of HPE's commitment to providing powerful, flexible tools for infrastructure management at scale.*

**About the Author**: This tutorial was created by the HPE iLOrest development team to help customers maximize the value of their HPE infrastructure through automation and best practices.

**Last Updated**: December 22, 2025

**Tags**: #HPE #iLOrest #ComputeOpsManagement #Automation #InfrastructureAsCode #ServerManagement #CloudManagement #HPEDev

