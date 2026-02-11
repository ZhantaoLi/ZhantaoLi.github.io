---
title: CSTC & OSCA
tags:
  - Storage
categories: Storage
date: 2026-01-24
updated: 2026-01-24
---

[[toc]]
<!-- more -->
## CSTC(中国科技云)

::: info
**20GB**  
Reference: 
 - https://linux.do/t/topic/1505165  
 - https://mp.weixin.qq.com/s/h1yuli7-74E4YAuLYNU9WQ
:::

### 注册并创建 S3 存储桶

1. 进入 [数据胶囊](https://data.cstcloud.cn/) 网站，选择Github登录(可以不用实名)。  
2. 成功进入 `我的数据` 界面，选择 `新数据空间`，或者对已有数据空间进行 `管理数据`。  
3. 选择 `客户端访问`， 可以看到 `S3客户端`、`WebDAV客户端`、`MCP客户端` 等选项以及对应参数。  
4. 选择 `S3客户端`，点击 `新增AccessKey`，创建AccessKey ID 与 AccessKey Secret。  
5. 至此成功拿下 **20GB** S3 存储桶的访问权限。  

### 在 Obsidian 和 Zotero 中配置使用

> 在 Obsidian 中使用 Remotely save 插件，配置 CSTC 的 S3 存储桶，实现多端同步。
> 在 Zotero 中使用 WebDAV 进行同步。

 * API Endpoint: `s3.cstcloud.cn`
 * Region: `us-east-1`
 * Access Key ID: `<你的Access Key ID>`
 * Secret Access Key: `<你的Secret Access Key>`
 * Bucket Name: `<你的桶名>`
 * S3 URL style: `path-style`

---

## OSCA(开放科学计算联盟云)

::: info
**1TB**
注册需要网站管理员审核(没试过);
学生可以直接在 [CARSI](https://ds.carsi.edu.cn/resource/resource.php) 登录访问资源。  
因此，只建议学生使用。

Reference: 
 - https://linux.do/t/topic/1505165/68
 - https://docs-ocloud.ihep.ac.cn/
:::

### 学生登录OSCA(https://ocloud.ihep.ac.cn/)

在 [CARSI](https://ds.carsi.edu.cn/resource/resource.php) 登录，选择 `开放科学计算联盟云(OSCA)` 进行访问资源。或者在 [登录页面](https://user-ocloud.ihep.ac.cn/login) 点击CARSI登陆即会跳转至CARSI登陆页面。

### 在 Obsidian 中配置使用
> 这个好像只有 S3，Zotero 的 WebDAV 用不了。

在 Obsidian 中使用 Remotely save 插件，配置 OSCA 的 S3 存储桶，实现多端同步：

 * API Endpoint: `https://fgws3-ocloud.ihep.ac.cn`
 * Region: `us-east-1`
 * Access Key ID: `<你的Access Key ID>`
 * Secret Access Key: `<你的Secret Access Key>`
 * Bucket Name: `<你的桶名>`

---

## 核心概念

### S3/对象存储
 S3是Simple Storage Service的简称，用户可以用它存储各种类型的数据（包括图片、视频、文档等）。在S3中一切数据都是Object（对象），故也被叫做对象存储。OSCA联盟云提供了兼容S3标准的RESTFul API方便用户调用。

### Object/对象/文件
在OSCA中，用户操作的基本单元是Object（对象），每个Object包含Key、Meta和Data，期中Key就是Object的名称，Meta是Object的属性信息，Data为实际Object的数据。每个文件都是一个Object，目录也属于文件，但其名称结尾为“/”。每一个Object都归属于一个Bucket中。

### Bucket/桶
Bucket（桶）是存储数据的容器，Bucket名称具有全局唯一性，创建后无法修改名称。用户创建的Bucket在OSCA每一个Endpoint（服务端点）都可以进行读取数据，为了方便上传下载和提高访问速度，建议根据业务情况就近请求最近的Endpoint。

### Endpoint/服务端点/文件网关端点
Endpoint（服务端点）是用户访问数据的入口，用户数据在每一个Endpoint都可以进行读取，为了方便上传下载和提高访问速度，建议根据业务情况就近请求最近的Endpoint。Endpoint使用AccessKey&SecretKey进行鉴权访问。

### AccessKey&SecretKey/AK&SK/访问密钥
用户注册OSCA后系统会自动分配一对AccessKey（AK）&SecretKey（SK）。当用户访问Endpoint时需要使用AKSK进行签名验证。调用AKSK进行的操作代表用户自己在做对应的操作。

## 总结

其实由 WebDAV 和 S3 的可玩性是很多的，很多软件都支持。

比如：数据胶囊由于只有20G和协议丰富，适合数据同步/备份；OSCA 有1TB，可以当个网盘玩玩。

[Alist/Openlist 连接 OSCA 存储](https://docs-ocloud.ihep.ac.cn/docs/osca-oss/client/s3-tools/alist.html)

[使用 Rclone 连接 OSCA 存储](https://docs-ocloud.ihep.ac.cn/docs/osca-oss/client/s3-tools/rclone.html)