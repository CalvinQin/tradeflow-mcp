# TradeFlow MCP

TradeFlow 的 OAuth 连接包和配套 Agent Skill。适用于支持远程 HTTP MCP/OAuth 的 Agent；全部业务由你公司的 TradeFlow 服务执行。这个包提供无密钥配置、Skill安装/更新和可重复的合成示例。

## 1.0.3 候选版本（Prerelease）— 2026-10-09

本版本作为候选发布，严格全站验收仍未完成。阿里店铺授权到期后的续授权、Meta 广告执行仍缺少真实外部验收条件，保留未验说明。

客户月结的单次合成图片识别与结算已通过真实 OAuth、MCP SDK、原网站接口及隔离数据库的软件流程验收。识别服务对合成图片返回的原警告保持不变；人工核对图片所示金额后使用原签名票据结算。这不代表银行到账，也不证明上述两项外部流程已经完成。

五种角色使用本人账号连接：老板、业务员、打包员、会计、社媒运营。工具通过网站原路由运行，网站的岗位、对象归属、字段、金额、版本、审批、幂等和审计继续生效。连接授权不代表任意业务写入授权。

## 下载与连接

从本仓库 Releases 下载同一版本的连接包/Skill。也可克隆仓库；Node.js 22以上，无第三方依赖。

```sh
node bin/tradeflow-mcp.mjs config https://YOUR-COMPANY/api/mcp
node bin/tradeflow-mcp.mjs install-skill --dir /YOUR/AGENT/skills
```

把配置导入 Agent 的 MCP 设置，选择 OAuth，点击“去认证”，使用本人账号登录并核对授权。无需后台密码、手填 Token 或手工拼接回调参数。OAuth发现、动态注册、PKCE、令牌存储与续期由接收配置的 MCP 客户端完成。这个包不实现或冒充令牌代理，不能把打开网页称为连接成功。

## 工具

| 工具 | 用途 |
|---|---|
| get_tradeflow_context | 本人身份、公司范围、契约指纹、分类与限制 |
| list_business_operations | 按分类/关键词分页发现网站操作 |
| get_business_operation_contract | 原网站参数、字段、schema与校验说明 |
| execute_business_operation | 原业务路由实际读写 |
| prepare_business_action | 删除、外发、审批等内容绑定预览票据 |
| get_business_operation_result | 本凭证持久结果、未知结果核对 |
| execute_business_batch | 最多20项独立顺序操作和逐项结果 |
| read_business_response_file | 导出文件后续字节，不重做导出 |

已授权普通操作直接完成。删除、对外发送、付款/审批和权限配置需要用户明确确认，且仍须原网站操作门禁。工资与个人信息依原网站范围；不会因为连接MCP而变成全员可读。后台密码/API Token不返回。

字段目录不是数据库CRUD接口。参数中的unknown是源码索引无法给出独立类型的部分；Agent须遵守当前网站契约和字段说明，原路由实际运行全部自定义校验。旧Alibaba复盘专项工具只在真实角色与范围允许时出现。

自然语言新建/修改产品和订单的[四条完整工作流](skill/tradeflow-mcp/references/product-order.md)说明先查客户、产品规格、付款档案，再用原JSON契约保存并回读。用户已经请求的普通保存连续完成；仅对真实缺项、身份歧义或敏感业务动作核对。产品/订单详情的 `wireInput.body` 含实际必填项和规格、选配嵌套结构。

## 更新与同步

`contract.json` 和 `operations.json` 是同包发布的契约快照。开始任务先与 `get_tradeflow_context.contractHash` 核对；不一致时采用服务器当前发现结果并升级包。

```sh
node bin/tradeflow-mcp.mjs update-skill --dir /YOUR/AGENT/skills
node bin/tradeflow-mcp.mjs contract
node --test test/*.test.mjs
node scripts/verify.mjs
```

安装器只更新本包管理的Skill，并保留旧目录备份，不读取或覆盖其他Agent配置。网站项目的同步守卫比对路由、控制器、领域服务、schema、权限中间件、数据库模型字段和页面调用的实际指纹，不能只改版本号通过。网站发布与本包GitHub发布是独立验收阶段。网站维护者执行 `npm run mcp:sync` 同步契约、全站计划、场景 Skill 和公开快照，再用只读 `mcp:sync:check` 检查；手写操作配方不被覆盖。全站验收通过真实 OAuth、SDK、网站接口和隔离数据库运行，严格门禁检查当前源与实际场景证据；缺项和陈旧证据不能作为完整交付。详见网站项目 `docs/mcp/README.md`。

文件单块最多256KiB，MCP请求上限24MiB，业务请求仍受各网站接口自己的上限；通用适配请求最多16MiB，二进制响应最多64MiB。写导出原件可读取7天。分页与批量示例、结果未知和错误处理见Skill参考文档。

MIT许可证仅覆盖本公开连接包的新增代码和文档。TradeFlow网站后端、部署材料、业务数据和其他项目许可证不随本包开放。包内没有密钥、真实账号、客户/订单数据、生产配置或部署回执。
