# 产品、规格与目录

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

读取产品、分类、币种和价格口径；新建使用独立型号；先查已有规格轴、SKU、订单选配、MOQ、装箱资料和媒体绑定。

按当前产品 wireInput 构造普通保存；复制先读取源对象并分配新 id/型号，按网站复制规则检查媒体与规格；编辑只提交用户授权的变化。

重新查询产品摘要/选品目录，核对单位、规格组合、选配价格、HS Code、装箱参数和图片顺序；抽查此前正式订单快照保持原值。

税价显示切换不等于修改历史成交金额。模拟订货是客户端计算入口，先确认服务器是否暴露同源计算；没有该工具时明确说明这一计算入口未接入MCP，不能用产品查询冒充模拟。AI优化需已配置模型和费用授权。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/products.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="products"></a>
## 产品目录

自然语言任务：请按当前权限完成“产品目录”所需操作，并回读实际结果。业务步骤：

1. 卡片适合浏览图片，列表适合批量比较和调价。
2. 税前/税后价格切换只改变当前显示口径。
3. 进入编辑工作台可按章节维护完整资料。
4. 图片主图和排序会影响内部目录与客户分享。
5. 删除前检查订单快照、分享和展会引用。
6. 区分规格轴、订单选配、MOQ 和加价规则。
7. 旧规格待整理时先核对历史数据再迁移。
8. 调价模式固定在列表视图，先预览变更数量。
9. 导出目录前确认选择范围与价格口径。

角色候选：BOSS、SALES、PACKER。前置对象：product、category、variant-axis、order-option、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_products_by_id`：DELETE /api/products/:id
- `delete_system_product_update_notices`：DELETE /api/system/product-update-notices
- `delete_system_product_update_notices_by_noticeId`：DELETE /api/system/product-update-notices/:noticeId
- `get_products`：GET /api/products
- `get_products_by_id_deletion_preview`：GET /api/products/:id/deletion-preview
- `get_products_catalog_by_categories`：GET /api/products/catalog-by-categories
- `get_products_hs_code_search`：GET /api/products/hs-code/search
- `get_products_picker`：GET /api/products/picker
- `get_products_summary`：GET /api/products/summary
- `get_system_categories`：GET /api/system/categories
- `get_system_price_adjustment_notice`：GET /api/system/price-adjustment-notice
- `get_system_product_update_notices`：GET /api/system/product-update-notices
- `post_products`：POST /api/products
- `post_products_bulk_fill_category_metadata`：POST /api/products/bulk-fill-category-metadata
- `post_products_catalog`：POST /api/products/catalog
- `post_products_catalog_by_categories`：POST /api/products/catalog-by-categories
- `post_products_description_optimize`：POST /api/products/description/optimize；外部前提候选：真实付费模型、OCR或供应商
- `post_products_simulate_container`：POST /api/products/simulate-container
- `post_products_simulate_order`：POST /api/products/simulate-order
- `post_products_sync_images`：POST /api/products/sync-images
- `post_system_categories`：POST /api/system/categories
- `post_system_price_adjustment_notice`：POST /api/system/price-adjustment-notice
- `post_system_pricing_mode`：POST /api/system/pricing-mode
- `put_products_by_id`：PUT /api/products/:id

验收情景编号：`capability:products`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="product-editor"></a>
## 产品编辑工作台

自然语言任务：请按当前权限完成“产品编辑工作台”所需操作，并回读实际结果。业务步骤：

1. 搜索型号或名称快速定位。
2. 新建产品先填写型号和至少一个名称。
3. 删除前阅读目录、分享、展会和媒体影响。
4. 依次检查基本资料、图片、价格规格、订单选配、HS Code、装箱和刀模绑定。
5. 产品图片、规格和价格会影响多个业务入口。
6. 新增产品保存后才能绑定包装刀模版本。
7. 规格轴用于形成 SKU，订单选配用于客户下单时选择。
8. 加价和 MOQ 需与业务口径一致。
9. AI 检查先给差异和字段建议。
10. 页面有未保存内容时，不会自动覆盖为后台新数据。
11. 保存后再刷新确认目录显示。

角色候选：BOSS、SALES、PACKER。前置对象：product、category、variant-axis、order-option、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_products_by_id`：DELETE /api/products/:id
- `get_products`：GET /api/products
- `get_products_by_id_deletion_preview`：GET /api/products/:id/deletion-preview
- `get_products_picker`：GET /api/products/picker
- `get_products_summary`：GET /api/products/summary
- `post_products`：POST /api/products
- `put_products_by_id`：PUT /api/products/:id

验收情景编号：`capability:product-editor`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="product-variants"></a>
## 规格、SKU 与下单选配

自然语言任务：请按当前权限完成“规格、SKU 与下单选配”所需操作，并回读实际结果。业务步骤：

1. 从产品目录打开产品编辑工作台，在价格规格章节核对规格轴与已有组合；组合规格先在维度中补选项，不能只复制组合行绕过轴定义。
2. 逐规格填写名称、SKU、税前/税后价、装箱数、净重、毛重及包装/外箱尺寸；上传规格图片后选主图，图片加入图集须保存后生效。
3. 独立规格可“复制”后编辑，也可拖动排序；删除前核对订单与分享引用，历史订单保留原商品快照。
4. 在订单选配章节设置可选组、默认值、MOQ、数量规则和加价，区分形成SKU的规格与下单时的选配。
5. 保存产品后回到目录，用模拟订货选择规格检查单价、重量和体积，再在选品/订单表单检查选配。
6. 图片上传失败重新添加失败图片；字段错误按工作台提示修正，未保存修改保持在原产品，不用刷新覆盖草稿。

角色候选：BOSS、SALES、PACKER。前置对象：product、category、variant-axis、order-option、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_products_by_id`：DELETE /api/products/:id
- `get_products`：GET /api/products
- `get_products_by_id_deletion_preview`：GET /api/products/:id/deletion-preview
- `get_products_picker`：GET /api/products/picker
- `get_products_summary`：GET /api/products/summary
- `post_products`：POST /api/products
- `put_products_by_id`：PUT /api/products/:id

验收情景编号：`capability:product-variants`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="product-simulation"></a>
## 模拟订货

自然语言任务：请按当前权限完成“模拟订货”所需操作，并回读实际结果。业务步骤：

1. 在产品卡片或详情展开“模拟订货”，先核对当前美元/人民币以及税前/含税显示口径。
2. 有规格时在“模拟订货规格”选择目标组合，输入数量；数量必须为1至10亿的整数，错误直接显示在数量下方。
3. 阅读装箱结果的整箱和未满箱数量，查看货值、总毛重与总体积；标记估算重量/估算体积时不要当成真实仓库称量。
4. 出现“装箱数待补充”“待补充尺寸/重量”或“价格待补充”时到产品编辑补已确认资料，不能用0冒充未知值。
5. 调整数量或规格可即时重算，不需要保存；模拟不修改产品、订单或历史金额。
6. 正式报价或下单继续核对选配、散件包装及运费，这些不包含在模拟货值里。

角色候选：BOSS、SALES、PACKER。前置对象：product、category、variant-axis、order-option、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_products_summary`：GET /api/products/summary
- `post_products_simulate_order`：POST /api/products/simulate-order

验收情景编号：`capability:product-simulation`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="product-copy"></a>
## 产品资料复制与更新

自然语言任务：请按当前权限完成“产品资料复制与更新”所需操作，并回读实际结果。业务步骤：

1. 在产品卡片或列表的产品操作菜单选择“复制资料”，先确认型号与当前产品。
2. 看到复制成功提示后粘贴到目标沟通或文档，逐项核对名称、SKU、单位、当前价格口径和装箱资料。
3. 复制操作仅写剪贴板，不创建新产品，也不复制历史订单或付款凭证。
4. 复制失败可重新点击，仍失败时使用可见产品资料人工整理，发送前再次核对；不要把失败提示当成已复制。
5. 需要改资料时打开产品编辑工作台，修改对应字段并保存，再返回目录读取最新值后重新复制。
6. 小程序“产品更新”与目录编辑以实际岗位权限为准，目录更新不覆盖历史订单商品和金额快照。

角色候选：BOSS、SALES、PACKER。前置对象：product、category、variant-axis、order-option、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_products_by_id`：DELETE /api/products/:id
- `get_products`：GET /api/products
- `get_products_by_id_deletion_preview`：GET /api/products/:id/deletion-preview
- `get_products_picker`：GET /api/products/picker
- `get_products_summary`：GET /api/products/summary
- `post_products`：POST /api/products
- `put_products_by_id`：PUT /api/products/:id

验收情景编号：`capability:product-copy`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="catalog-export"></a>
## 产品目录导出与发布

自然语言任务：请按当前权限完成“产品目录导出与发布”所需操作，并回读实际结果。业务步骤：

1. 产品目录先勾选目标产品，或直接点击“导出 PDF 产品目录”按类目选择；勾选产品时导出当前勾选范围。
2. 弹窗选择税前价、含税价或不显示价格，检查币种与现有产品资料，不能用导出切换改写产品价格。
3. 按类目导出可全选/取消全选并拖动类目排序；检查已选类目数和产品数，没有有效范围时不能导出。
4. 核对当前语言和品名，点击“导出 PDF”，等待生成并保存文件，关闭弹窗不等于取消已产生的文件。
5. 打开PDF检查页码、图片、名称、单位、规格、报价口径和中文字体，再对外使用；公开展会目录按已发布语言与范围导出。
6. 生成失败保持原选择按提示重试；历史报价和订单不会因新目录价格自动变化，重新导出使用当前明确选择。

角色候选：BOSS、SALES、PACKER。前置对象：product、category、variant-axis、order-option、local-image；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_products_catalog_by_categories`：GET /api/products/catalog-by-categories
- `get_products_summary`：GET /api/products/summary
- `get_system_categories`：GET /api/system/categories
- `post_products_catalog`：POST /api/products/catalog
- `post_products_catalog_by_categories`：POST /api/products/catalog-by-categories
- `post_system_categories`：POST /api/system/categories

验收情景编号：`capability:catalog-export`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
