# 库存、打包与包装刀模

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

读取稳定产品/规格、现有库存与流水、正式订单/任务、包装层级UNIT/INNER/MASTER、刀模当前版本及成品尺寸。

库存变动按网站业务入口留来源；打包按订单数量上传真实照片和资料并更新任务。标准盒型/导入结构先保存不可变修订，校正/发布/绑定遵守原版本和确认规则。

核对库存余额与流水、任务商品/数量/状态/照片；读取新刀模修订及产品绑定。任务单取实际生成原件。

结构建议不能自动发布，折轴/孔位/断面需人工复核；历史修订不覆盖。装柜模拟的3D/客户端计算与实体打印仍有原入口边界，未暴露MCP的计算不能声称已执行。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/warehouse.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="packaging"></a>
## 包装结构实验室

自然语言任务：请按当前权限完成“包装结构实验室”所需操作，并回读实际结果。业务步骤：

1. 标准盒型可按成品长宽高直接生成。
2. 导入支持 SVG、矢量 PDF、ASCII DXF 与兼容 AI 文件。
3. 源文件和后续版本按不可变修订保留。
4. 先排除装饰线和文字，再处理真实结构线。
5. 有断面、伪铰链或孔位时必须人工复核。
6. 撤销/重做只影响当前校正草稿。
7. 检查印刷外侧、折叠方向、父子折轴和封底封顶顺序。
8. Gemini 只给有限结构建议，不能自动发布。
9. 发布前确认尺寸、比例、完整结构与打样提示。
10. 绑定时选择稳定产品、规格和 UNIT/INNER/MASTER 层级。
11. 归档可保留历史；永久删除不可恢复，必须谨慎。
12. Command/Ctrl + S 保存新修订，Command/Ctrl + Z 撤销，Shift + Command/Ctrl + Z 或 Ctrl + Y 重做。
13. 数字 1 / 2 切换 2D 与 3D；F 打开完整折叠程序；? 随时重开本教程。
14. 选中蓝色折轴后可用 Alt + 上/下调整折叠顺序，Escape 清除当前选择。

角色候选：BOSS、SALES、PACKER。前置对象：stock-product、stock-ledger、packing-task、design-template、design-version、local-svg；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_packaging_designs_by_designId`：DELETE /api/packaging-designs/:designId
- `delete_packaging_designs_by_designId_bindings_by_bindingId`：DELETE /api/packaging-designs/:designId/bindings/:bindingId
- `delete_packaging_designs_by_designId_permanent`：DELETE /api/packaging-designs/:designId/permanent
- `delete_packaging_designs_by_designId_versions_by_versionId_permanent`：DELETE /api/packaging-designs/:designId/versions/:versionId/permanent
- `get_packaging_designs`：GET /api/packaging-designs
- `get_packaging_designs_by_designId`：GET /api/packaging-designs/:designId
- `get_packaging_designs_by_designId_versions_by_versionId`：GET /api/packaging-designs/:designId/versions/:versionId
- `get_packaging_designs_by_designId_versions_by_versionId_export_pdf`：GET /api/packaging-designs/:designId/versions/:versionId/export.pdf
- `get_packaging_designs_by_designId_versions_by_versionId_export_svg`：GET /api/packaging-designs/:designId/versions/:versionId/export.svg
- `get_packaging_designs_by_designId_versions_by_versionId_preview`：GET /api/packaging-designs/:designId/versions/:versionId/preview
- `get_packaging_designs_by_designId_versions_by_versionId_source`：GET /api/packaging-designs/:designId/versions/:versionId/source
- `get_packaging_designs_product_bindings_by_productId`：GET /api/packaging-designs/product-bindings/:productId
- `get_packaging_designs_templates`：GET /api/packaging-designs/templates
- `patch_packaging_designs_by_designId_metadata`：PATCH /api/packaging-designs/:designId/metadata
- `patch_packaging_designs_by_designId_name`：PATCH /api/packaging-designs/:designId/name
- `post_packaging_designs_by_designId_versions_by_versionId_ai_suggestions`：POST /api/packaging-designs/:designId/versions/:versionId/ai-suggestions；外部前提候选：真实付费模型、OCR或供应商
- `post_packaging_designs_by_designId_versions_by_versionId_publish`：POST /api/packaging-designs/:designId/versions/:versionId/publish
- `post_packaging_designs_by_designId_versions_by_versionId_revisions`：POST /api/packaging-designs/:designId/versions/:versionId/revisions
- `post_packaging_designs_by_designId_versions_by_versionId_templates`：POST /api/packaging-designs/:designId/versions/:versionId/templates
- `post_packaging_designs_generate`：POST /api/packaging-designs/generate
- `post_packaging_designs_imports`：POST /api/packaging-designs/imports
- `post_packaging_designs_product_bindings_resolve`：POST /api/packaging-designs/product-bindings/resolve
- `post_packaging_designs_templates_by_templateId_instantiate`：POST /api/packaging-designs/templates/:templateId/instantiate
- `put_packaging_designs_by_designId_versions_by_versionId_bindings`：PUT /api/packaging-designs/:designId/versions/:versionId/bindings

验收情景编号：`capability:packaging`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="packing"></a>
## 仓库打包

自然语言任务：请按当前权限完成“仓库打包”所需操作，并回读实际结果。业务步骤：

1. PI 草稿不进入正式打包任务。
2. 关联订单只用于确实共用同一套打包资料的场景。
3. 逐行填写长宽高、箱数、单箱毛重和商品绑定。
4. 混装箱要写清各商品数量。
5. 毛重不是扣除纸箱后的净重。
6. 上传清晰图片或 PDF，检查承运商与单号。
7. 确实没有面单时才使用“无面单发货”。
8. 状态必须与真实资料同步。
9. 导出前检查净毛重、CBM、抬头和图片。
10. 付款凭证仅授权角色可查看。

角色候选：BOSS、SALES、PACKER。前置对象：stock-product、stock-ledger、packing-task、design-template、design-version、local-svg；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_inventory_categories`：GET /api/inventory/categories
- `get_inventory_records_by_productId`：GET /api/inventory/records/:productId
- `get_inventory_summary`：GET /api/inventory/summary
- `get_orders_by_id_packing_images_zip`：GET /api/orders/:id/packing-images.zip
- `get_orders_by_id_packing_print`：GET /api/orders/:id/packing-print
- `post_inventory_adjust`：POST /api/inventory/adjust
- `post_inventory_categories`：POST /api/inventory/categories
- `post_inventory_check_stock`：POST /api/inventory/check-stock
- `post_inventory_in`：POST /api/inventory/in
- `post_inventory_out`：POST /api/inventory/out
- `post_inventory_records_by_id_revoke`：POST /api/inventory/records/:id/revoke
- `post_orders_by_id_packing_list`：POST /api/orders/:id/packing-list
- `post_orders_by_id_packing_print_export`：POST /api/orders/:id/packing-print/export
- `post_orders_by_id_shipping_labels`：POST /api/orders/:id/shipping-labels
- `put_inventory_records_by_id`：PUT /api/inventory/records/:id

验收情景编号：`capability:packing`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="packing-simulator"></a>
## 装箱装柜模拟

自然语言任务：请按当前权限完成“装箱装柜模拟”所需操作，并回读实际结果。业务步骤：

1. 优先使用产品已确认的外箱尺寸。
2. 检查单位统一，避免毫米和厘米混用。
3. 比较装载率、剩余空间、重量和箱数。
4. 播放、重播和爆炸视图用于理解摆放顺序。
5. 检查承重、重心、门口空间和不可旋转方向。
6. 现场装柜前再次核对真实外箱。

角色候选：BOSS、SALES、PACKER。前置对象：stock-product、stock-ledger、packing-task、design-template、design-version、local-svg；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_products_picker`：GET /api/products/picker
- `get_products_summary`：GET /api/products/summary
- `post_products_simulate_container`：POST /api/products/simulate-container

验收情景编号：`capability:packing-simulator`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="inventory"></a>
## 库存管理

自然语言任务：请按当前权限完成“库存管理”所需操作，并回读实际结果。业务步骤：

1. 先按分类、产品和状态筛选。
2. 低库存或异常库存需要继续查看变动记录。
3. 选择正确产品与规格。
4. 出库数量不能超过允许口径。
5. 备注中写明关联订单或业务原因。
6. 发现差异时追溯具体记录，不直接改总数。
7. 业绩面板的库存趋势使用库存管理类目口径。

角色候选：BOSS、PACKER、SALES。前置对象：stock-product、stock-ledger、packing-task、design-template、design-version、local-svg；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_inventory_categories`：GET /api/inventory/categories
- `get_inventory_records_by_productId`：GET /api/inventory/records/:productId
- `get_inventory_summary`：GET /api/inventory/summary
- `post_inventory_adjust`：POST /api/inventory/adjust
- `post_inventory_categories`：POST /api/inventory/categories
- `post_inventory_check_stock`：POST /api/inventory/check-stock
- `post_inventory_in`：POST /api/inventory/in
- `post_inventory_out`：POST /api/inventory/out
- `post_inventory_records_by_id_revoke`：POST /api/inventory/records/:id/revoke
- `put_inventory_records_by_id`：PUT /api/inventory/records/:id

验收情景编号：`capability:inventory`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="task-print"></a>
## 订单任务单与现场打印

自然语言任务：请按当前权限完成“订单任务单与现场打印”所需操作，并回读实际结果。业务步骤：

1. 打开订单或仓库任务，核对商品型号、规格和数量；Web订单菜单点击“打印订单”，小程序详情点击“订单任务打印 / 导出”。
2. 在“A4 订单任务”预览按需要勾选产品图，检查页数和箱规填写位置；任务单不包含金额，PI草稿不代替正式仓库作业。
3. Web可“复制第…页”“批量以图片复制”“导出 Word”“导出 PDF”或“打印订单”；多页未完整粘贴时改为逐页复制或Word，剪贴板需要浏览器权限。
4. 小程序使用“批量保存图片”“导出 Word”或“查看 / 打印 PDF”，生成后可“转发文档”；微信不支持复制图片到剪贴板。
5. 相册权限不足点击“允许保存到相册”打开系统设置，再保存尚未成功的页；“已保存…/…页”与逐页失败提示用于核对，预览失败点击“重试预览”。
6. 打印前检查纸张、尺寸、分页及图片可读性；导出、相册保存与实体打印分别验收，任务单保存不会自动推进打包或发货。

角色候选：BOSS、SALES、PACKER。前置对象：stock-product、stock-ledger、packing-task、design-template、design-version、local-svg；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_orders_by_id`：DELETE /api/orders/:id
- `get_orders_by_id`：GET /api/orders/:id
- `get_orders_by_id_packing_images_zip`：GET /api/orders/:id/packing-images.zip
- `get_orders_by_id_packing_print`：GET /api/orders/:id/packing-print
- `post_orders_by_id_packing_list`：POST /api/orders/:id/packing-list
- `post_orders_by_id_packing_print_export`：POST /api/orders/:id/packing-print/export
- `put_orders_by_id`：PUT /api/orders/:id

验收情景编号：`capability:task-print`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
