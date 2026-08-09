---
title: 'Fixing Coolify Container Networking on Oracle Cloud After a Reboot'
description: 'A reboot restored a tangled iptables snapshot that blocked Docker container traffic. Here is how GPT 4.6 Sol helped me diagnose and clean it up.'
date: '2026-07-26'
date_updated: ''
category: 'Systems'
tags:
  - Coolify
  - Oracle Cloud
  - Docker
  - iptables
  - Self-hosting
  - sysadmin
  - GPT Sol 4.6
published: true
slug: gpt-4-6-sol-fix-coolify-deployments-oracle-cloud
---

I'm writing this down because there aren't many people writing about their longer-term experience running Coolify on Oracle Cloud.

I use an Oracle Cloud PAYG ARM Virtual Machine, Coolify, Tailscale to host a few projects.

There is a lot of content and reddit posts about the free tier VMs and hosting minecraft servers. Not enough of troubleshooting stuff like [port opening for beginners](https://www.reddit.com/r/oraclecloud/comments/r8lkf7/a_quick_tips_to_people_who_are_having_issue/). Much less about what happens after you've used one for a while, installed Docker, added Tailscale, experimented with UFW, deployed and deleted projects, then forgotten half the commands you ran months earlier.

I'm definitely not a Docker, Linux networking or VM expert. I troubleshooted successfully thanks to GPT 4.6 Sol as a sounding board during the investigation. I ran the diagnostic commands, supplied the output, and pushed back whenever it proposed changes that felt too invasive.

The eventual cause was an old `iptables` snapshot being restored after a reboot.

Getting there took a while.

## Deployment error

My Coolify deployments suddenly stopped being able to download anything.

The most obvious failure came from an Alpine-based stage:

```text
RUN apk add --no-cache ca-certificates

fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/main/aarch64/APKINDEX.tar.gz

WARNING: fetching ... temporary error (try again later)

ERROR: unable to select packages:
  ca-certificates (no such package):
    required by: world[ca-certificates]
```

Other build stages running in parallel were then cancelled:

```text
RUN go mod download
CANCELED

RUN apt-get update && apt-get install ...
CANCELED
```

The final Coolify error pointed at:

```dockerfile
RUN apk add --no-cache ca-certificates
```

At first glance, it looked like an Alpine mirror issue, a DNS failure or something specific to the ARM repository.

`ca-certificates` was still there.

APK had failed to download the repository index. Without that index, it could no longer find the package and reported it as missing.

## Why I rebooted the VM

There had been a Cloudflare outage.

I wasn't sure whether my own server was affected, whether Oracle Cloud was having problems, or whether something on the VM had gone wrong.

So I rebooted it.

That reboot was what brought an older firewall problem back.

## Similar failures had happened before

I had seen similar deployment failures after Coolify updates. It was annoying in the past because deployments would fail after Coolify auto updated, and I wasn't aware all new builds failed because I was too lazy to set up observability infrastructure.

Restarting Docker sometimes appeared to fix them:

```bash
sudo systemctl restart docker
```

Sometimes it didn't.

I also tried setting explicit DNS servers in Docker:

```json
{
	"dns": ["1.1.1.1", "8.8.8.8"]
}
```

That never fixed the problem consistently.

The DNS request still had to leave the container through Docker's forwarding path. Changing the resolver did nothing if container traffic was being blocked before it reached the internet.

## Testing the host and container separately

The useful test was to try the same Alpine URL directly from the VM:

```bash
curl -4 --fail --silent --show-error --head --connect-timeout 10 https://dl-cdn.alpinelinux.org/alpine/v3.21/main/aarch64/APKINDEX.tar.gz

curl -6 --fail --silent --show-error --head --connect-timeout 10 https://dl-cdn.alpinelinux.org/alpine/v3.21/main/aarch64/APKINDEX.tar.gz
```

The host could reach it.

Then tested from a clean Docker container:

```bash
docker run --rm alpine:3.21 sh -c '
  echo "=== DNS ==="
  nslookup dl-cdn.alpinelinux.org

  echo "=== APK ==="
  apk update
'
```

The container couldn't.

The Alpine mirror and the VM's general internet connection were working. The failure was specific to traffic leaving Docker's bridge networks.

## Docker traffic takes a different path

Traffic originating directly from the VM doesn't pass through the same firewall path as traffic forwarded from a Docker container.

Docker creates firewall rules for:

- bridge networking;
- container isolation;
- port publishing;
- forwarding;
- NAT and masquerading.

Container egress passes through the host's forwarding rules.

That led to:

```bash
sysctl net.ipv4.ip_forward

sudo iptables -L FORWARD -n -v
sudo iptables -S FORWARD

sudo iptables -L DOCKER-USER -n -v
sudo iptables -S DOCKER-USER
```

The output was a mess.

## FORWARD chain had 139 rules

The server did have several legitimate Docker networks, but that didn't account for everything.

The chain contained repeated copies of:

- `DOCKER-USER`;
- `DOCKER-ISOLATION-STAGE-1`;
- Docker bridge rules;
- UFW forwarding chains;
- unconditional `REJECT` rules.

The rough structure looked like this:

```text
Docker rules for several bridges
REJECT everything else

More Docker rules
REJECT everything else

UFW forwarding rules

More Docker rules
REJECT everything else

More Docker rules
REJECT everything else
```

Some Docker bridge rules appeared before the first blanket rejection. Others appeared after it.

Apparently once traffic reached one of those unconditional `REJECT` rules, anything below it no longer mattered.

## Why restarting Docker sometimes helped

I cannot prove the exact sequence from the logs I still have.

The most likely explanation is that restarting Docker caused it to recreate rules for its current networks. Some of those rules may then have appeared near the beginning of the chain, before the stale rejection rules.

That would explain why the problem could seem to resolve itself:

- restart Docker;
- deployment works again;
- another update or network recreation happens;
- a later deployment fails;
- restart Docker again.

A new Coolify deployment could also create a new bridge whose rules landed behind one of the old rejection rules.

The behaviour was inconsistent because the firewall state was inconsistent.

## Old rules were stored on disk

Thanks to Sol, the bigger clue came from:

```bash
sudo cat /etc/iptables/rules.v4
```

The file began with:

```text
# Generated by iptables-save v1.8.10 (nf_tables)
# on Fri Dec 5 23:05:12 2025
```

It contained:

- Docker bridge IDs from December 2025;
- old container IP addresses;
- published-port rules;
- Docker masquerading rules;
- UFW chains;
- Oracle's `InstanceServices` rules;
- repeated Docker sections;
- several blanket rejection rules.

`netfilter-persistent` was active.

That meant the VM was loading this file during startup.

The likely sequence was:

1. I saved the live firewall into `/etc/iptables/rules.v4` at some point.
2. The saved state already contained Docker, UFW and Oracle rules.
3. It may already have contained more than one generation of Docker rules.
4. I rebooted the VM months later.
5. `netfilter-persistent` restored the December snapshot.
6. Docker and Tailscale added their current rules.
7. The restored and current rules became mixed together.
8. Some Docker traffic reached an old rejection rule before the rule intended for its current bridge.

The reboot did exactly what the server had been configured to do.

The saved configuration was the problem.

## How did it become so tangled?

Idk? Over time I tried stuff I saw online, so it's the price to pay for being a noob trying to run my own VM. It sucks when it breaks, and worse when there's bandaid on top of bandaid.

```bash
sudo systemctl restart docker
sudo ufw enable
sudo iptables -I INPUT -j ACCEPT
iptables-save > /etc/iptables/rules.v4
```

There had also been Coolify projects and Docker networks created and removed over time, Tailscale rules, UFW rules and several rounds of network troubleshooting.

Shell history only records the commands. It doesn't tell me what the firewall looked like before each one, whether every command succeeded, or what I was trying to fix at the time.

The December file definitely contained Docker runtime state and duplicated sections. I can't say though which particular command or incident created duplicates.

If it's not me being a shitty sysadmin, then it's something for other Oracle Cloud and Coolify users to watch out for!

## Temporary fix

The first objective was to restore container internet access without deleting rules belonging to Docker, Coolify, Tailscale or Oracle.

We inserted explicit bridge egress rules into `DOCKER-USER`.

Docker evaluates this chain early in its forwarding path, which made it possible to accept the traffic before it reached the stale rejection rules.

The script (thx 4.6 Sol):

> This was written for my VM, which has one normal default route through the VM's primary network interface `enp0s6`. Adapt it for your own case.

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH=/usr/sbin:/usr/bin:/sbin:/bin

WAN_IF=""

# Docker may need a moment to create DOCKER-USER.
for _ in $(seq 1 60); do
    if iptables -nL DOCKER-USER >/dev/null 2>&1; then
        WAN_IF="$(
            ip -4 route show default 2>/dev/null |
            awk 'NR == 1 {print $5}'
        )"

        if [ -n "$WAN_IF" ]; then
            break
        fi
    fi

    sleep 1
done

if ! iptables -nL DOCKER-USER >/dev/null 2>&1; then
    echo "DOCKER-USER chain was not created" >&2
    exit 1
fi

if [ -z "$WAN_IF" ]; then
    echo "Could not determine the default network interface" >&2
    exit 1
fi

ensure_rule() {
    if ! iptables -w 10 -C DOCKER-USER "$@" 2>/dev/null; then
        iptables -w 10 -I DOCKER-USER 1 "$@"
    fi
}

# Allow Docker bridges to reach the internet.
ensure_rule \
    -i docker0 \
    -o "$WAN_IF" \
    -j ACCEPT

ensure_rule \
    -i br+ \
    -o "$WAN_IF" \
    -j ACCEPT

# Allow established responses back to the containers.
ensure_rule \
    -i "$WAN_IF" \
    -o docker0 \
    -m conntrack --ctstate RELATED,ESTABLISHED \
    -j ACCEPT

ensure_rule \
    -i "$WAN_IF" \
    -o br+ \
    -m conntrack --ctstate RELATED,ESTABLISHED \
    -j ACCEPT

logger -t docker-egress-fix \
    "Docker bridge egress rules installed using interface $WAN_IF"
```

I saved it then added a systemd drop-in for Docker so it runs whenever Docker does:

```ini
[Service]
ExecStartPost=/usr/local/sbin/docker-egress-fix.sh
```

Container downloads worked again. (Thank you Sol!)

## Confirming that the workaround was active

The `DOCKER-USER` counters later showed packets passing through the new rules, so it was carrying real container traffic.

But the stale snapshot was still there, so another reboot could break Docker networking again.

## Letting Coolify clean its own resources

As a no regrets move, I ran Coolify's manual cleanup before changing firewall persistence. (It was silly of me too for not enabling the automated cleanup of Docker networks in Coolify settings.)

The live `FORWARD` chain dropped from 139 rules to 119.

Coolify had removed actual Docker resources and the live rules associated with them.

After cleanup, `docker network ls` showed only the current networks:

```text
bridge
coolify
do80ksgsg8wggsc8ws8cg84w
host
mwkkwcs
none
ykkwwo0owow804gkc0go40k4
```

All the custom networks still had containers attached.

## Remaining bridge rules had no Docker networks

The firewall still referred to bridge IDs such as:

```text
br-01cd6253f179
br-011c80411398
br-c2a8bdc13e00
br-7aec736ddf98
br-945157230ff6
br-a81909427cbd
br-a2681de568b8
```

None of them appeared in `docker network ls`.

Docker could not clean these rules because the corresponding network objects no longer existed.

They survived only as text inside the restored December firewall snapshot.

At this point, removing more projects or running more Docker cleanup would not solve the main issue.

## Avoiding a manual rule-by-rule cleanup

I didn't want to delete 100 firewall rules individually. Also didn't want to flush all of `iptables`, disable Docker's firewall management, or replace the whole setup with a firewall configuration I had written myself.

Most of the valid rules belonged to other software. So the safer approach was to stop restoring the historical snapshot and let each service reconstruct its own current rules.

## Preserving Oracle's instance-service rules

The saved file also contained Oracle's `InstanceServices` chain.

These rules controlled access to Oracle's link-local services under `169.254.0.0/16`, including metadata, internal DNS, NTP and storage-related endpoints.

I didn't want to discard these together with the stale Docker rules. So I moved the Oracle-specific rules into a separate script and systemd service.

The script only managed:

```text
InstanceServices
```

and one `OUTPUT` jump:

```text
-A OUTPUT -d 169.254.0.0/16 -j InstanceServices
```

It didn't change:

- `INPUT`;
- `FORWARD`;
- Docker bridges;
- Docker NAT;
- Coolify ports;
- Tailscale.

## Backing up the existing state

Before changing persistence:

```bash
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="/root/firewall-prevention-$STAMP"

sudo install -d -m 0700 "$BACKUP"

sudo iptables-save |
    sudo tee "$BACKUP/iptables-live.v4" >/dev/null

sudo ip6tables-save |
    sudo tee "$BACKUP/iptables-live.v6" >/dev/null

sudo cp -a /etc/iptables "$BACKUP/"
sudo cp -a /usr/local/sbin/docker-egress-fix.sh "$BACKUP/" 2>/dev/null || true
sudo cp -a /etc/systemd/system/docker.service.d "$BACKUP/" 2>/dev/null || true
```

The old files remained available for rollback.

## Moving the Oracle rules into their own service

The systemd unit:

```ini
[Unit]
Description=OCI InstanceServices iptables rules
After=local-fs.target
Before=docker.service

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/oci-instance-services-firewall.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

I enabled and tested it before touching the old snapshot:

```bash
sudo systemctl daemon-reload
sudo systemctl enable oci-instance-services-firewall.service
sudo systemctl start oci-instance-services-firewall.service
```

Then checked that the service had installed one clean jump:

```bash
sudo iptables -S OUTPUT | grep InstanceServices
```

Output:

```text
-A OUTPUT -d 169.254.0.0/16 -j InstanceServices
```

## Retiring the old snapshots

I renamed the old files instead of deleting them:

```bash
sudo mv \
  /etc/iptables/rules.v4 \
  /etc/iptables/rules.v4.stale-2025-12-05

sudo mv \
  /etc/iptables/rules.v6 \
  /etc/iptables/rules.v6.stale-2025-12-05
```

Then disabled `netfilter-persistent`:

```bash
sudo systemctl disable netfilter-persistent.service
```

I didn't stop the service during the live session. The goal was to prevent the next boot from restoring the files, without risking an unexpected flush of the current firewall.

The temporary Docker egress script remained and I didn't delete it.

## Planned reboot

Before rebooting, the expected state was:

```text
oci-instance-services-firewall.service: enabled
netfilter-persistent.service: disabled
```

The stale files were still available:

```text
rules.v4.stale-2025-12-05
rules.v6.stale-2025-12-05
```

Docker still had:

```ini
ExecStartPost=/usr/local/sbin/docker-egress-fix.sh
```

Then:

```bash
sudo reboot
```

## Firewall after reboot

The services came back as expected:

```text
oci-instance-services-firewall: active
netfilter-persistent: inactive
docker: active
tailscaled: active
```

Oracle's rule was present:

```text
-A OUTPUT -d 169.254.0.0/16 -j InstanceServices
```

Docker recreated rules for its current networks.

The `FORWARD` chain dropped from 119 rules before reboot to 23 afterwards.

The remaining bridge rules matched the current Docker networks:

```text
br-f2a0dd84050a
br-9dee279ca063
br-9d4ac8e8da6e
br-98dbe851b021
```

The old bridges were gone.

So were the repeated UFW sections and blanket rejection rules between Docker networks.

## Testing container internet access again

The final check:

```bash
docker run --rm alpine:3.21 sh -c '
  nslookup dl-cdn.alpinelinux.org &&
  apk update
'
```

Docker pulled the image.

DNS returned both IPv4 and IPv6 results.

Alpine downloaded its repository indexes:

```text
v3.21.7-177-g164e277e844
v3.21.7-176-g85a2ff48d7c

OK: 25251 distinct packages available
```

The container still had working internet access after a full reboot without the old snapshot.

## Keeping the egress workaround

I left the four `DOCKER-USER` rules installed.

They may no longer be necessary now that the forwarding chain is clean. I didn't see much benefit in testing their removal immediately after a successful repair.

The script is easy to inspect, and its counters still show active traffic.

Removing it can be a separate maintenance task with a rollback ready.

## Public access is still controlled by Oracle

I already use an Oracle Cloud Network Security Group to control inbound access above the VM.

I therefore didn't use this exercise to redesign the host's inbound firewall or manually restrict every Docker-published port.

That would have introduced another set of changes unrelated to the deployment failure.

The aim here was narrower: stop restoring obsolete Docker runtime rules after every reboot.

## How 4.6 Sol helped

I would not have diagnosed this without 4.6 Sol, it's just crazy how good it is.

When I tried to triage the issue last time, Geminis (2.5, 3.1, flash lul) and Opus 4.6/4.7 all didn't help with this in the way it can now.

4.6 Sol helped interpret each new output and correctly suggested tests, possible hypotheses. It connected the host-versus-container result to the forwarding path, compared the live firewall with rules.v4, and helped separate Oracle's rules from Docker's runtime state.

It also suggested some broader firewall changes that I was uncomfortable with. I pushed back, explained that most of the ports and rules belonged to Coolify or Docker, and we narrowed the plan, then executed it.

The plan was really much better than other LLMs tbh.

## Things I would do differently

### Test from the failing environment

A successful request from the VM doesn't prove that a Docker build container can reach the same destination.

The container test found the boundary much faster.

### Capture the firewall before changing it

At minimum:

```bash
sudo iptables-save > /root/iptables-before.v4
sudo ip6tables-save > /root/ip6tables-before.v6
```

Shell history was useful, but it could not reconstruct every previous rule or command result.

### Avoid persisting the whole firewall on a Docker host

The saved file included temporary Docker state:

```text
bridge IDs
container addresses
published ports
masquerading rules
```

Restoring it months later created a firewall containing several different points in time.

### Let services manage their own rules

Docker rebuilt Docker's current networks.

Tailscale rebuilt its forwarding rules.

A small custom service restored only Oracle's `InstanceServices` rules.

Much safer than manually trying to recognise and delete every stale rule.

## Final state

Before cleanup:

```text
139 FORWARD rules
```

After Coolify cleanup:

```text
119 FORWARD rules
```

After retiring the old snapshot and rebooting:

```text
23 FORWARD rules
```

I triggered a real Coolify deployment afterwards, and the Alpine and Go download stages completed normally.

The old firewall snapshots remain backed up, but they are no longer loaded at boot.

A surprisingly long investigation caused by one old file under:

```text
/etc/iptables/
```

And a reminder that a reboot can faithfully restore problems you had forgotten were there.
