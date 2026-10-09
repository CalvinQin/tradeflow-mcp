# 商品保存、资料复制与模拟订货

执行规格：`apps/server/tests/businessMcpFullsiteProducts.test.ts`、`businessMcpFullsiteSimulation.test.ts`。规格与以下参数是可执行配方；是否计入当前验收以全站清单为准。

所有操作先读取 `get_business_operation_contract`。使用本人 OAuth 连接；普通商品编辑与只读计算沿用当前具体任务授权。POST/PUT 保留一个 operationId，收到 COMPLETED 后用原 operationId 查询 `get_business_operation_result`；未知结果先查回执，不能换 ID 重做。

1. `get_products_summary`，`query:{ids:"<商品ID>"}`：读取单位、USD/CNY 税价、稳定 variantId、轴、选配及箱规。摘要没有 description/size；需要说明、单件尺寸时使用 `get_products` 的完整商品。`get_products_picker` 可按 q/ids/page 查找，按实际 page/hasMore 分页。
2. 新建用 `post_products`，body 至少 `{id,model,name,price,stock:0}`，另传已经核实的 unit、size、qtyPerCarton、cartonSize、netWeight、grossWeight。规格使用 `{variantId,sku,variantName,axisValues,price,...}`，轴与选配使用原结构化契约。未知商业值不能补造。
3. 编辑用 `put_products_by_id`，`params:{id}`，body 只包含明确修改字段，例如 `{description:"已核对文本",unit:"台"}`；回读完整商品，核对原 variants/options 保留。原路由目前没有 editVersion 参数，不编造版本门禁。
4. 复制资料先用 `get_products` 回读完整商品，按现有共享 `formatProductClipboardText` 的资料格式核对型号、名称、单位、说明、单件/包装信息、海关编码和规格。需要剪贴板时使用当前客户端实际复制入口并核对提示，粘贴/外发沿用目标文档或发送授权；MCP读取商品不表示已经写入电脑剪贴板。当前该能力的MCP完整流程/剪贴板结合验收仍待补齐，不能把新建商品副本当作资料复制通过。另有明确新建副本任务时，`post_products` 创建新商品id/model和新variantId/sku，回读源与副本确认独立；这只是商品新增配置流程。
5. 模拟订货用 `post_products_simulate_order`，body `{productId,quantity:23,currency:"USD",withTax:false}`。有规格的商品必须传稳定 variantId；quantity 为 1 至 10 亿整数。币种仅 USD/CNY，价格从真实商品读取，不能提交自定义 price。核对 result.quantity/unit/subtotal/fullCartons/looseItems/totalCBM/totalWeight/totalNetWeight，以及 volumeEstimated/weightEstimated。缺报价或尺寸可为 null；规格商业价格不继承主商品。散件体积和毛重是估算，选配、运费另计。返回 `READ_ONLY_NO_BUSINESS_WRITE`，不生成订单或库存记录。
6. 删除只在用户已明确授权该对象时执行：`get_products_by_id_deletion_preview` 先核对产品和关联影响，`prepare_business_action` 绑定完全相同的 `delete_products_by_id` 参数与 operationId，再执行。回读摘要为空；不要把 prepare 票据当成新的用户授权。

400 参数或规格已失效：重新读取商品并更正明确输入。403：停止当前身份操作，不能换人绕过。404：重新确认对象。409：读取原对象和版本并按原用户意图判断；不要覆盖并发修改。计算返回值不表示已创建正式订单。

## 类目、品名组与批量补资料

`get_system_categories` 返回完整配置和 `productNamesRevision`。改类目时用 `post_system_categories` 保存完整当前数组，不只发送一个类目；保留原 id、未知字段、其他类目与中英文品名组。修改当前品名组时必须原样带回读取到的 revision；409 表示其他人刚改过，重新读取再按原意更新。类别名称不超过50字，id/name不可重复。原路由允许老板或打包员保存；业务员可读取，但不能借MCP改类目配置。改名会同步产品类目、历史别名与库存启用类目，不是重新创建产品。

`post_products_bulk_fill_category_metadata` 参数为 `body:{category,nameCn?,nameEn?,hsCodeCn?,hsCodeUs?,overwrite:false}`，至少一个补充字段。默认只填空白，已有品名与海关编码保留；`overwrite:true` 只在用户明确要求覆盖时使用。读取 matchedCount/updatedCount/fieldCounts 并回读受影响产品；不能把匹配数量当更新数量。此路由会匹配该类目全部产品，包括已归档产品。

归档用 `put_products_by_id` 的 `{status:"archived"}`；重新启用用 `{status:"active"}`。归档商品保留历史记录，选品器和按类目PDF不再展示，完整产品资料仍可查询。改规格必须带 `hasVariants:true` 和完整稳定variantId配置；只有variants字段不能当成已保存规格。产品所有规格使用主产品unit，不能另造规格单位。

## 调价与更新记录

商品真实价格通过 `put_products_by_id` 保存，再回读当前币种的真实价格及规格。`post_system_price_adjustment_notice` 仅发布通知，不修改商品价格：`body:{notice:{summary,changes:[{productId,productModel,productName,variantName?,field:"price"|"priceWithTax",oldValue,newValue}]}}`。先保存真实调价再发通知；不得用通知接口冒充调价成功。老板/打包员可发布，业务员不能发布。`get_system_price_adjustment_notice` 回读最新公告；`get_system_product_update_notices` 的 `limit:0` 读取完整产品更新记录，默认50，其他值按原上限处理。

删除更新记录使用 `delete_system_product_update_notices_by_noticeId`，`params:{noticeId}`；批量清理使用 `delete_system_product_update_notices`，`body:{throughDate:"YYYY-MM-DD"}`，截止北京时间该日23:59:59.999。两者仅老板/平台管理员可执行，需原用户删除授权和绑定相同参数的prepare票据。删除通知不会删除商品或回滚历史订单金额。正确重复使用operationId读取原回执，不能重复生成通知或清理新数据。

## 三种产品目录 PDF

按产品选择用 `post_products_catalog`：`body:{productIds:[id1,id2],priceMode:"preTax"}`，保留选择顺序。按类目用 `post_products_catalog_by_categories`：`body:{categories:[name1,name2],priceMode:"withTax"}`，保留类目顺序，同类目内按型号排序。小程序原件下载另有 `get_products_catalog_by_categories`：`query:{categories:JSON.stringify([name1,name2]),priceMode:"none"}`。三种税价显示方式是preTax/withTax/none；none不展示售价。按类目导出自动排除已归档产品；直接指定产品id的PDF按指定对象生成，不把两种行为混淆。

所有已登录角色可导出，不能加上网站没有的老板专用限制。首段file可能不完整：POST原件用operationId，GET原件用responseId调用 `read_business_response_file`，offset续接nextOffset，length最高256KiB，直到hasMore=false。核对完整totalBytes与SHA256、PDF可解析、实际产品/规格/描述/包装/价格内容。凭证之间不能共享原件句柄；账户离职或原权限失效后停止续读。MCP下载不是已经把文件发给客户。

## 图片同步与计价模式

`post_products_sync_images` 会扫描订单，仅更新可明确匹配的商品图片。优先真实productId；缺失productId不改挂到同名商品。历史型号仅在一个产品匹配时才可匹配；规格sku也必须唯一。未知或歧义规格保留历史图片，不猜。执行前预览/确认同步范围，执行后核对updated/skipped/total；历史数量、规格、单位、单价、币种、运费和总金额全部保留。图片治理可能因旧版本有效引用而保留实体文件，不表示删除失败。

`post_system_pricing_mode` 仅老板/平台管理员使用，body `{mode:"rmb_base"|"legacy_usd",usdToRmbRate,commissionUsdToRmbRate}`。两个汇率为0.1至100有效有限值。切换人民币基价时只补缺少的CNY价格，旧美元价格按固定历史迁移汇率6.8迁移一次；已有CNY值含显式0保留。新的展示汇率不反复迁移或修改已记录订单。付款档案profiles是同一路由的另一配置分支，不能误混进计价模式请求。

## AI说明优化与公开海关编码查询

`post_products_description_optimize` 只提交已有型号、品名、类目和真实描述；返回每行“· ”的纯英文说明，不自动保存商品。必须核对未新增未知数字、材质、认证或性能，再按原编辑授权使用 `put_products_by_id` 保存。无事实400；没有模型配置503 `AI_CONFIGURATION_MISSING`，无生成文本，MCP回执可能UNKNOWN，先查回执不能换id盲重做。不能宣称配置错误测试已生成实际文案。

`get_products_hs_code_search` 使用 `query:{q:"8467",provider:"us"}`，真实公开来源USITC，返回items最多30条及description/generalRate/specialRate/units。关键词仅作候选检索，不能以关键词命中自动确认商品税则归类或税率。中国HS在线查询已移除（cn返回400），需核实后手动填写。查询不写入产品；只有确认具体编码后才保存。外部服务不可用时报告实际失败，不能伪造查询结果。
