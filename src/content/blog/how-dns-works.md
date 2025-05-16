---
title: "How The Domain Name System Works"
description: "How the Domain Name System Works"
pubDate: "May 16 2025"
---

Domain Name System helps translate a domain e.g **example.com** to an ip address that a computer can use to communicate over the internet e.g **172.217.14.174**.

When you type a domain on your browser e.g, **www.google.com**, your browser checks its application cache to see if it has the IP address for **google.com**. This just helps it respond faster. If it has no records, it asks the Operating System which stores its own records. Typically once DNS resolution happens these caches are usually updated.

If the operating system doesn't have the domain, it now has to go out to the DNS system, which is a globally distributed network of computers that help with domain name resolution. Your OS will either come preconfigured with some popular DNS IPs e.g _Google's_ **8.8.8.8** **8.8.4.4** or _Cloudflare's_ **1.1.1.1**. If not, it can use **DHCP** - _Dynamic Host Configuration Protocol_ to get this information from your router or other devices on your network.

## 🌐 The DNS System Structure

The DNS system follows the following structure as it tries to resolve your domain names to IP addresses.

**Root Name Servers → Top Level Domain Servers → Name servers**

### 🧊 Root Name Servers

These servers do not know the IP address of your specific service, but they know which TLD servers are responsible for which domains e.g **.com** or **.africa**. Their main job is to direct DNS queries to the appropriate Top Level Domain server.

### 🔝 Top Level Domain Servers

These store top level domains. A top level domain example is **.com** **.gov** **.za** **.ru** **.usa** **.africa**.

If you have a **.africa** domain, there are set of top level domain servers that will contain information about domains in that zone.

TLD servers resolve name servers e.g we want to go to **andrew.africa**, so now that we are on the server that resolves **.africa** we need to know who hosts **andrew.africa**. Name Servers do this, so TLD Servers point us to Name Servers.

### 🏢 Name Servers

Name servers contain the actual records for your domain. e.g the IP of your server. These are also typically domain registrars but they might not be.

When we build applications and buy a domain from godaddy, e.g **andrew.africa** we need to point all traffic to our new domain to our server. So if we are running our app on vercel we need to point all traffic to **andrew.africa** to vercel where our app is running. This involes updating a bunch of records on the name server. We typically do this on their dashboards.

Vercel will give you **A** **AAAA** **CNAME** records to add to your name server records. This is how the Name Server knows the IP of your service and responds to domain resolution requests with an IP address.

### 📋 Common DNS Record Types

This is what those records do and what they mean

#### 🟢 A Records

Points to an IPV4 address e.g **10.67.12.11** - your vercel app. Vercel will take care of the port configuration

#### 🔵 AAAA Records

Point to an IPV6 address e.g **2001:0db8:85a3:0000:0000:8a2e:0370:7334**

#### 🟡 CNAME

Maps subdomains e.g **mail.andrew.com**, **app.andrew.com** to different subdomains in vercel e.g **mail.andrew-site.vercel.app** and **app.andrew-site.vercel.app**

#### 🟣 MX Records (Mail Exchange)

Records that tell other people where your valid emails come from.

#### 🖤 TXT Records (Text Records)

Vercel might ask you to put a TXT record on your name server containing a certain value so it can validate you are in control of that domain. This prevents abuse e.g pointing domains to domains you do not own like pointing coinbase.com to your app assuming coinbase.com was also served by vercel and general abuse.

## 🔄 After Registering Your Domain

Once you register a domain and update its DNS records (e.g., with A or CNAME entries), it typically takes some time for those changes to propagate across the global DNS network. This usually takes minutes to hours, but sometimes up to 48 hours. Once complete, users around the world will be able to reach your website via the new domain.

## 🔁 Example DNS Resolution Flow

A resolution for example.com goes to:

**Root Name Server → The TLD `.com` → Name Server (e.g GoDaddy) → resolves to Vercel’s CDN**

Here are example DNS records for this domain

<img src="/images/typography/dnsrecon.png"/>
