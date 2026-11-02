---
title: DoH 与 ECH 原理与配置记录
description: DNS over HTTPS (DoH) 与 Encrypted Client Hello (ECH) 的工作原理、主流浏览器配置与常用测试工具整理。
tags:
  - DoH
  - ECH
categories: network
date: 2026-11-02
updated: 2026-11-02
---

[[toc]]

记录一下 DoH (DNS over HTTPS) 与 ECH (Encrypted Client Hello) 的基本原理、浏览器配置方法与测试工具。

<!-- more -->

## 1. 背景与基本原理

在常规 HTTPS 连接建立过程中，即便传输数据已加密，仍存在两个阶段会暴露目标域名：

1. **DNS 解析阶段**：传统 DNS 使用 UDP 53 端口明文传输，易被局域网嗅探或运营商污染/篡改。
2. **TLS 握手阶段**：TLS 1.2 及未启用 ECH 的 TLS 1.3 在发送 `Client Hello` 时，`SNI (Server Name Indication)` 字段以明文传输，中间链路设备可通过 DPI 直接读取并实施重置或阻断。

```text
传统连接:   [明文 DNS 查询] -> [TCP 握手] -> [明文 SNI (Client Hello)] -> [加密传输]
DoH + ECH: [加密 DoH 查询] -> [TCP 握手] -> [加密 ECH (Client Hello)] -> [加密传输]
```

### 1.1 DoH (DNS over HTTPS)

- 将 DNS 查询请求封装在标准 HTTPS (通常为 443 端口) 中传输。
- 解决 DNS 查询的明文窃听与结果篡改问题。

### 1.2 ECH (Encrypted Client Hello)

- 前身为 **ESNI (Encrypted SNI)**。ESNI 仅对 SNI 字段加密，且在握手重试和握手参数协商上不够灵活。
- **ECH 工作机制**：
  - 将握手报文拆分为 **Outer Client Hello** 与 **Inner Client Hello**。
  - **Outer Client Hello**：对公网可见，携带公用的公开域名（`public_name`，如 CDN 托管域名）及 `encrypted_client_hello` 扩展。
  - **Inner Client Hello**：通过 HPKE（混合公钥加密）整体加密，内部包含真正的目标域名（`private_name`）与完整的握手参数。

### 1.3 DoH 与 ECH 的依赖关系

ECH 客户端在发起握手前，必须获取服务端的 ECH 公钥配置（`ECHConfigList`）。该配置通过域名的 **HTTPS 资源记录 (Type 65)** 或 **SVCB 记录 (Type 64)** 进行下发。

若未使用 DoH，中间设备可篡改或剥离 DNS 返回中的 HTTPS 记录，导致客户端降级为传统明文 SNI。因此 **DoH 是 ECH 可靠运行的前提**。

---

## 2. 常用 DoH 地址

### 公共服务

- **Cloudflare**
  ```text
  https://cloudflare-dns.com/dns-query
  https://1.1.1.1/dns-query
  ```
- **阿里公共 DNS**
  ```text
  https://dns.alidns.com/dns-query
  ```
- **腾讯 DNSPod**
  ```text
  https://doh.pub/dns-query
  ```

### 网关与中转方案

- **Cloudflare Zero Trust (Gateway)**
  ```text
  https://<your-id>.cloudflare-gateway.com/dns-query
  ```
- **Cloudflare Pages / Worker 反代**
  ```text
  https://2026doh-6eg.pages.dev/cloudflare/dns-query
  ```
- **社区反代/镜像**
  ```text
  https://xxx.ddd.oaifree.com/query-dns
  ```

---

## 3. 客户端 / 浏览器配置

### 3.1 Chromium 内核（Chrome / Edge）

1. **启用实验性 Flag**：
   - 打开 `chrome://flags` 或 `edge://flags`：
     - `#encrypted-client-hello` -> `Enabled`
     - `#use-dns-https-svcb-alpn` -> `Enabled`
   - 重启浏览器。
2. **配置安全 DNS**：
   - 进入 `设置` -> `隐私和安全` -> `安全` -> `使用安全 DNS`。
   - 选择自定义提供商，填入支持 HTTPS 记录解析的 DoH 地址。

### 3.2 Firefox

1. 打开 `about:config`：
   - `network.dns.echconfig.enabled` -> `true`
   - `network.dns.use_https_rr_as_alpn` -> `true`
2. 配置 TRR（Trusted Recursive Resolver）：
   - `network.trr.mode`：
     - `2`：优先使用 DoH（失败时回退系统 DNS）。
     - `3`：强制仅使用 DoH。
   - `network.trr.uri`：填写 DoH 服务器 URL（例如 `https://cloudflare-dns.com/dns-query`）。

---

## 4. 测试与验证

### 4.1 在线检测

- **Cloudflare ESNI/ECH 检测**：[https://www.cloudflare-cn.com/ssl/encrypted-sni/](https://www.cloudflare-cn.com/ssl/encrypted-sni/)
- **DEFO ECH 测试**：[https://test.defo.ie/](https://test.defo.ie/)
- **TLS-ECH 测试**：[https://tls-ech.dev/](https://tls-ech.dev/)
- **Packet Guru ECH 检查**：[https://packet.guru/web/ech-check](https://packet.guru/web/ech-check)
- **Cloudflare CDN 链路追踪**：`https://crypto.cloudflare.com/cdn-cgi/trace`（检查 `sni=encrypted`）

### 4.2 Wireshark 抓包确认

过滤条件：`tcp.port == 443`。

- 查看客户端发送的第一个 `Client Hello`。
- `Server Name Indication` 显示为外层公共域名（如 CDN 共享域名）。
- 扩展列表中存在 `Extension: encrypted_client_hello`，说明内部 SNI 已加密。

---

## 5. 注意事项

1. **中间阻断与降级**：部分受限网络会对包含 ECH 扩展的握手包直接进行 RST 重置或丢包，触发客户端降级或连接中断。
2. **企业代理与解密**：企业内网安全设备（如 SSL Inspection 网关）通常依赖明文 SNI 进行合规审查，会在网关层过滤 HTTPS 资源记录或阻断 ECH。
3. **分流优化**：直接使用海外 DoH 可能导致国内 CDN 无法进行就近调度，建议搭配分流规则使用（国内域名走本土 DoH，外网目标走支持 HTTPS 记录的 DoH）。
