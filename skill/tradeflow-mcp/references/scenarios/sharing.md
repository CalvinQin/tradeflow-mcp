# 产品分享与公开采购意向

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

明确客户/用途、最小产品范围、价格/语言/访问码/有效期、产品媒体引用。

私有MCP入口创建和管理分享；公开访客用原分享协议验证访问码、读取已发布商品、提交采购意向。重置/撤销/删除取得精确授权。

查分享配置、公开范围、意向记录；重置后旧码拒绝、撤销后旧链接拒绝，意向不生成未经确认的正式订单。

公开目录不等于内部全量目录；访问码是任务私有材料。原公开访问与提交不能伪装成本人私有MCP普通写入。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/sharing.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="product-shares"></a>
## 客户产品分享

自然语言任务：请按当前权限完成“客户产品分享”所需操作，并回读实际结果。业务步骤：

1. 确认客户与用途，避免把内部全部产品误公开。
2. 访问码与链接应通过受控渠道发送。
3. 更新产品范围后重新检查公开页面。
4. 重置访问码会使旧访问码失效。
5. 撤销可停止访问并保留记录。
6. 永久删除不可恢复。
7. 目录图片仍按媒体引用规则治理。

角色候选：BOSS、SALES、PACKER。前置对象：product、share、access-code、submission、public-visitor；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_product_shares_by_id`：DELETE /api/product-shares/:id
- `get_mini_product_shares`：GET /api/mini-product-shares
- `get_product_shares`：GET /api/product-shares
- `get_product_shares_by_id`：GET /api/product-shares/:id
- `get_product_shares_by_id_submissions`：GET /api/product-shares/:id/submissions
- `get_public_product_shares_by_token`：GET /api/public/product-shares/:token（excluded，使用原协议）
- `get_public_product_shares_by_token_preview`：GET /api/public/product-shares/:token/preview（excluded，使用原协议）
- `patch_product_shares_by_id`：PATCH /api/product-shares/:id
- `post_mini_product_shares`：POST /api/mini-product-shares
- `post_mini_product_shares_by_id_revoke`：POST /api/mini-product-shares/:id/revoke
- `post_product_shares`：POST /api/product-shares
- `post_product_shares_by_id_publish`：POST /api/product-shares/:id/publish
- `post_product_shares_by_id_reset_code`：POST /api/product-shares/:id/reset-code
- `post_product_shares_by_id_revoke`：POST /api/product-shares/:id/revoke
- `post_product_shares_by_id_submissions_by_submissionId_converted`：POST /api/product-shares/:id/submissions/:submissionId/converted
- `post_public_product_shares_by_token_submissions`：POST /api/public/product-shares/:token/submissions（excluded，使用原协议）
- `post_public_product_shares_by_token_unlock`：POST /api/public/product-shares/:token/unlock（excluded，使用原协议）
- `put_product_shares_by_id`：PUT /api/product-shares/:id

验收情景编号：`capability:product-shares`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="public-catalog"></a>
## 客户公开目录与意向提交

自然语言任务：请按当前权限完成“客户公开目录与意向提交”所需操作，并回读实际结果。业务步骤：

1. 从业务员提供的产品分享链接进入；需要访问码时输入完整六位数字并点击“查看产品”，确认专属客户、报价币种及有效期。
2. 浏览已发布范围，选择规格并填写产品数量；可复制型号/数据/参数，内部完整产品目录不会因此公开。
3. 查看装箱与装柜估算，必要时切换柜型或“一键填满当前柜型”；先填一种或多种产品作为比例，箱规缺失或不能装入时按提示修正。
4. 在“提交选品意向”填写给业务员的备注，检查数量及装柜结果，点击“提交选品结果”。
5. 在“确认提交这份选品吗”中核对后确认，看到“提交成功，选品已收到”再结束；内部人员仍需复核和提供PI，意向不是正式订单。
6. 访问码不完整、链接失效或计算失败时保留当前需求并联系专属业务员；通过联系名片使用已公开电话、邮箱或二维码，不自行寻找内部身份。

角色候选：PUBLIC。前置对象：product、share、access-code、submission、public-visitor；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_product_shares_by_id`：DELETE /api/product-shares/:id
- `get_mini_product_shares`：GET /api/mini-product-shares
- `get_product_shares`：GET /api/product-shares
- `get_product_shares_by_id`：GET /api/product-shares/:id
- `get_product_shares_by_id_submissions`：GET /api/product-shares/:id/submissions
- `get_public_product_shares_by_token`：GET /api/public/product-shares/:token（excluded，使用原协议）
- `get_public_product_shares_by_token_preview`：GET /api/public/product-shares/:token/preview（excluded，使用原协议）
- `patch_product_shares_by_id`：PATCH /api/product-shares/:id
- `post_mini_product_shares`：POST /api/mini-product-shares
- `post_mini_product_shares_by_id_revoke`：POST /api/mini-product-shares/:id/revoke
- `post_product_shares`：POST /api/product-shares
- `post_product_shares_by_id_publish`：POST /api/product-shares/:id/publish
- `post_product_shares_by_id_reset_code`：POST /api/product-shares/:id/reset-code
- `post_product_shares_by_id_revoke`：POST /api/product-shares/:id/revoke
- `post_product_shares_by_id_submissions_by_submissionId_converted`：POST /api/product-shares/:id/submissions/:submissionId/converted
- `post_public_product_shares_by_token_submissions`：POST /api/public/product-shares/:token/submissions（excluded，使用原协议）
- `post_public_product_shares_by_token_unlock`：POST /api/public/product-shares/:token/unlock（excluded，使用原协议）
- `put_product_shares_by_id`：PUT /api/product-shares/:id

验收情景编号：`capability:public-catalog`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
