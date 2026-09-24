# Security policy

## Reporting a vulnerability

If you discover a security vulnerability in this n8n community node,
please report it privately.

**Do not open a public GitHub issue** — that exposes the vulnerability
to everyone before we can ship a fix.

Instead, email **henk@bluemarker.be** with:

- A description of the vulnerability
- Steps to reproduce (or a proof-of-concept if you have one)
- The affected node version(s)
- Your name/handle for credit (optional)

You should get an acknowledgment within 2 business days. We'll work
with you on a fix and coordinate the disclosure timeline.

## Scope

In scope for security reporting:

- OAuth2 credential handling bugs (token leakage, incorrect refresh
  flow, secrets exposed in error messages or logs)
- Injection vulnerabilities in request construction (e.g. attacker-
  controlled input escaping the node's contract to modify the API
  request in unintended ways)
- Any vulnerability that lets a workflow author or external input
  escalate access beyond the OAuth2 scope granted to the credential

Out of scope:

- Vulnerabilities in the Teamleader Focus API itself — please report
  those to Teamleader directly at
  [support.focus@teamleader.eu](mailto:support.focus@teamleader.eu).
- Vulnerabilities in `devDependencies` — they don't ship to consumers.
- Vulnerabilities in n8n itself — report to
  [n8n's security channel](https://github.com/n8n-io/n8n/security).

## Supported versions

Only the latest MINOR release receives security fixes. Older versions
get a coordinated advisory but no patch backport.
