# TradeFlow MCP

TradeFlow 的 OAuth 连接包和配套 Agent Skill。适用于支持远程 HTTP MCP/OAuth 的 Agent；全部业务由你公司的 TradeFlow 服务执行。这个包提供无密钥配置、Skill安装/更新和可重复的合成示例。

Skill 是给 Agent 使用的业务操作说明：指导它发现本人可用的操作、核对字段和版本、完成已授权任务并回读结果。OAuth 提供网站身份与访问范围，Skill 提供处理客户、产品、订单等任务的工作流；两者配合使用。

## 1.0.5 候选版本（Prerelease）— 2026-10-10

客户老板核实、全体在职业务员批注通知、48小时计划队列、12小时宽限与30天回收站同步。红色核实要求approve/delete/send权限和内容绑定票据，绿色核实保留真实操作人；广播执行使用准备时冻结的收件人body，名单变化需重新准备。旧客户直改工具不能绕过核实确认。

严格全功能门禁仍为 **INCOMPLETE**；Meta真实执行与阿里续授权等外部行为仍未验，本候选不宣称正式全功能通过。客户核实/旧客户/高级客户真实OAuth SDK同源11项、公开包安装/更新3项验证通过；其他全站证据按当前契约指纹筛选，旧版数字不是本版验收证明。合成软件流程不代表银行到账或上述外部操作已完成。

五种角色使用本人账号连接：老板、业务员、打包员、会计、社媒运营。工具通过网站原路由运行，网站的岗位、对象归属、字段、金额、版本、审批、幂等和审计继续生效。连接授权不代表任意业务写入授权。

## 下载与连接

从[官方 Releases](https://github.com/CalvinQin/tradeflow-mcp/releases)取得连接包/Skill；按下方流程选择与服务器契约匹配的版本并校验。Node.js 22以上，无第三方依赖。以下命令在已下载、校验并解压的包根目录运行，`--dir` 使用接收 Agent 实际配置的 skills 目录。

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

`contract.json` 和 `operations.json` 是同包发布的契约快照。已完成 OAuth 连接后，每次任务开始先读取 `get_tradeflow_context.contractHash`，与已安装 Skill 的 `contract.json` 比较；一致时继续使用。

环境支持下载、SHA256 校验、Node.js 和写入 skills 目录时，首次安装或指纹不一致应由 Agent 自动完成：

1. 查找包含该指纹的官方 Release（可能是候选版本），取得同一 Release 的 ZIP/TGZ 和 `SHA256SUMS`；不要只按最新版本号选择。
2. 校验压缩包 SHA256 与 `SHA256SUMS` 一致后解压到独立目录，再确认包内 `contract.json.contractHash` 与服务器一致。
3. 在该包根目录首次运行 `install-skill`，已有安装运行 `update-skill`；完成后回读目标目录的 `contract.json`，确认版本与指纹。

```sh
node bin/tradeflow-mcp.mjs update-skill --dir /YOUR/AGENT/skills
node bin/tradeflow-mcp.mjs contract
```

`install-skill` / `update-skill` 只安装当前已下载包里的 Skill，不会联网下载新版本。安装器更新本包管理的目录前创建 `tradeflow-mcp.backup-*` 备份；保留备份，不覆盖非本包管理的 Skill 或其他 Agent 配置。没有匹配 Release，或环境缺少下载、校验、执行或写入能力时，报告具体未完成步骤，继续使用服务器实时发现的契约；不能把下载文件、输出命令或旧版本安装说成更新成功。

网站项目的同步守卫比对路由、控制器、领域服务、schema、权限中间件、数据库模型字段和页面调用的实际指纹，不能只改版本号通过。网站发布与本包GitHub发布是独立验收阶段。网站维护者执行 `npm run mcp:sync` 同步契约、全站计划、场景 Skill 和公开快照，再用只读 `mcp:sync:check` 检查；手写操作配方不被覆盖。全站验收通过真实 OAuth、SDK、网站接口和隔离数据库运行，严格门禁检查当前源与实际场景证据；缺项和陈旧证据不能作为完整交付。详见网站项目 `docs/mcp/README.md`。

文件单块最多256KiB，MCP请求上限24MiB，业务请求仍受各网站接口自己的上限；通用适配请求最多16MiB，二进制响应最多64MiB。写导出原件可读取7天。分页与批量示例、结果未知和错误处理见Skill参考文档。

MIT许可证仅覆盖本公开连接包的新增代码和文档。TradeFlow网站后端、部署材料、业务数据和其他项目许可证不随本包开放。包内没有密钥、真实账号、客户/订单数据、生产配置或部署回执。
