# 货代、合并与物流地址预设的操作手册

这是当前原网站的操作顺序和输入说明；实际执行状态见当前验收报告及 `businessMcpFullsiteLogistics.test.ts`。先通过 `get_tradeflow_context` 与 `get_business_operation_contract` 核对公司、角色、权限和字段。示例数据必须换成真实资料，不能将测试地址用在真实发货中。

## 查询和维护货代

`get_forwarders`，query `{search,page,limit}`；page 为正整数，limit 为1到1000。返回 `{data,pagination}`，根据 totalPages 继续取所需页。搜索覆盖货代名称、联系人、电话、仓库地址、微信、备注、关联客户和国家。当前货代目录是公司共享资料，不存在可以随意传入其他公司编号的查询入口。

业务员或老板用 `post_forwarders` 新建，body 例如：

```json
{
  "name": "已核实的货代公司名称",
  "contact_person": "[\"已核实联系人\"]",
  "phone": "[\"真实电话\"]",
  "address": "[\"真实仓库地址及入仓代码\"]",
  "wechat": "真实微信号",
  "supports_customs": true,
  "related_customers": "[\"真实客户名称\"]",
  "related_countries": "[\"真实国家名称\"]",
  "notes": "实际操作要求和已核实备注"
}
```

多值字段在当前网站里是存储 JSON 数组的字符串，不能直接传 JSON 数组；旧记录也可能是单条普通字符串，读取时保留原值。supports_customs 是布尔值。新建后回读返回 id 和全部字段。`put_forwarders_by_id`，params `{id}`，提交需要改变的同名字段；原未改字段保持。使用一个稳定 operationId，重试沿原载荷和编号。

客户、仓库、报关和联系人不能靠名称猜测；歧义先查已有目录。会计、打包和社媒用户的读取、修改权限沿用原网站角色规则，不因为能查看公司目录就能修改。收到400/404/403时按原错误解释；服务器结果未知时查原回执和目录，不能换编号再建一条。

## 手动准备合并与模型建议

用户明确要求合并指定货代时，先读每条原记录及对应 id，核对名称、电话、地址、联系人、相关客户/国家和操作备注。`post_forwarders_prepare_merge` body `{ids:[主候选编号,来源编号]}` 返回 `{analysis}`：

- source 为 manual；masterId 和 suggestedName 指向原记录。
- candidates 的每个字段条目含 value、sourceIds、sourceNames，可追溯原值。
- selected 汇总 contacts、phones、addresses、customers、countries、wechat、notes。
- supportsCustoms 汇总原记录的支持报关能力。

准备不会修改或删除记录。逐项核对并保留冲突信息，不能从只有地址的记录推断其报关能力。

`post_forwarders_analyze_merge` body `{ids}` 可提供模型建议。缺少模型配置或分析失败时，网站会返回 source=fallback 的原字段完整汇总；如实告诉用户“分析服务没配好，已保留原资料供核对”。200 不等于 AI 分析成功，fallback 不是模型确认同一公司。仍需按真实证据和授权决定合并。

`post_forwarders_scan_duplicates` 扫描公司全部货代，返回 scannedCount、candidateCount、groups、source、message。source 的 rules、mixed、ai、jev 含义不同：rules 只是现有字段的候选，mixed 中部分也只是规则候选。无候选时无需调用模型；候选中的原因、forwarderIds 和实际字段先核对。扫描不会自动合并，也不能把“同一联系人/电话”候选说成已经确认同一主体。

## 执行已核对的合并

`post_forwarders_merge` 会保留选中的主记录并删除其它所选来源记录，是敏感操作。先 prepare_business_action 展示具体主记录、来源 id、最终字段及删除影响。用户已明确授权这些具体记录的合并时沿用授权，不重复询问；笼统“检查重复”不是删除授权。

执行 body：

```json
{
  "ids": [11,12],
  "masterId": 11,
  "newName": "用户确认的最终名称",
  "customData": {
    "contacts": ["已核实联系人甲","已核实联系人乙"],
    "phones": ["已核实电话甲","已核实电话乙"],
    "addresses": ["确认保留的仓库及入仓代码"],
    "customers": ["真实关联客户"],
    "countries": ["真实国家"],
    "wechat": "确认保留的微信号",
    "supports_customs": true,
    "notes": "保留来源及用户确认的实际操作说明"
  }
}
```

这里 customData 的列表是 JSON 数组，和普通货代 CRUD 的存储字符串不同。notes/wechat 是字符串。masterId 使用所选真实编号，不能凭推荐名称造编号。回读 success/mergedId、主记录全部字段、来源已删除、其它未选择记录仍在；同 operationId 回放不会再次删除。目录合并不是修改历史订单商业条款，不重算旧金额或改写已经发货订单。无 customData 的兼容合并采用网站原汇总规则；为避免遗漏冲突字段，优先发送已核对的明确字段。

单条删除 `delete_forwarders_by_id`，params `{id}`，同样核对具体记录和原票据。不存在的记录不是成功删除；先读当前目录，删除后回读。不能先删除再声称已完成合并。

## 维护发货和收货地址预设

`get_system_logistics_address_presets` 返回 `{success,data}`，登录用户可查询以便选真实地址。管理写入使用原网站的平台管理权限：老板可管理；其他岗位须有实际平台管理员授权，社媒运营即使带平台标记也不能管理。普通业务员、会计、打包用户只能读取，不能修改。

新建用 `post_system_logistics_address_presets`，通常不传 id 由系统生成。传入的 id 已存在会返回409；需要修改时使用原地址的更新操作，不能重试新建覆盖原地址。更新用 `put_system_logistics_address_presets_by_id`，params `{id}`；当前是完整地址保存，需要保留未改必填字段：

```json
{
  "displayName": "真实联系人或地址简称",
  "purpose": "BOTH",
  "isDefaultSender": true,
  "isDefaultRecipient": false,
  "company": "真实公司",
  "contactPerson": "真实联系人",
  "mobile": "真实联系电话",
  "email": "真实联系邮箱",
  "phoneCode": "+86",
  "countryCode": "CN",
  "countryName": "中国",
  "province": {"name":"真实省份","code":"已核实区域代码"},
  "city": {"name":"真实城市"},
  "district": {"name":"真实区县"},
  "postalCode": "真实邮编",
  "address": "真实街道门牌",
  "address2": "实际附加地址"
}
```

purpose 是 SENDER、RECIPIENT 或 BOTH。省/州与城市需要 name；可选 code/areaId 仅填查询到的真实值，不推测区域代码。SENDER 不能成为默认收货地址，RECIPIENT 不能成为默认发货地址；默认发货/收货各只保留一个，设置新的默认会取消旧默认。回读地址、purpose、默认标记和其它地址，不能仅确认新条目而漏查旧默认。

删除预设 `delete_system_logistics_address_presets_by_id`，params `{id}`，核对引用和具体授权后执行并回读。仅保存或选择地址预设不等于下物流单，也不表示已经发货。

## 查物流与公开货代交接

订单物流、物流分享和阿里物流询价/下单属于不同原协议。按已发现的当前订单 id、店铺和物流订单 id 进入对应操作，不把货代编号当物流单号。订单管理与公开物流分享流程见 orders 配方；阿里物流服务见 alibaba 章节。公开分享 token 是访问票据，不能发布到无关聊天或代替 OAuth 身份。

上传面单必须传真实文件，下载必须校验实际 bytes 和 sha256。报价计算成功不等于付款或下单，上传面单不等于承运商揽收；只按实际后台状态与第三方回执汇报。缺少真实授权或供应商配置时保留这个缺口，不编造运价、物流状态或送达结果。
