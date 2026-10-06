# HosieryLab V1 完整开发方案

> **当前范围：只做 Hosiery Database（丝袜/连裤袜/长筒袜及相关腿部服饰数据库）。**
>
> 裙子数据库、鞋与配饰、Outfit Graph、Looks、Best With / Avoid With 关系、AI Virtual Stylist 和公开 API 暂不进入 V1，只在文末保留后续路线。

## 1. 产品定位

HosieryLab 是一个面向丝袜、连裤袜、长筒袜、过膝袜、袜类结构和相关腿部服饰的视觉知识数据库。

它不是电商目录，也不是单纯图片图库，而是把以下内容放在同一套标准中：

- 可验证的产品事实
- 统一的长度、覆盖范围、结构、Denier、颜色、材质和表面分类
- 自有标准视觉参考
- 历史、技术和文化节点
- 可复用的比较、搜索、筛选和 AI Prompt 数据
- 清晰的来源、置信度和合成标记

产品核心路径是：

> **发现 → 对比 → 学习 → 理解视觉差异**

### 品牌承诺

HosieryLab 的核心承诺是：

> **Every pair, under the same light.**

每条丝袜都在统一的字段、统一的视觉语言和透明的来源标记下被记录。用户能够知道它是什么、覆盖到哪里、为什么看起来不同、这些信息从哪里来，以及哪些内容是 HosieryLab 的标准化变体。

## 2. V1 范围与边界

### 2.1 V1 必须交付

1. 首页、导航、搜索、组合筛选、URL 状态、详情页和 Compare。
2. 至少 100 条已验证 Hosiery 记录，并配套 100 → 500 → 1,000 → 10,000 的生产流程。
3. Length Class、Coverage、Top Position、Construction、Garment Type、Foot、Toe、Heel、Top Band、Support 作为一级数据维度。
4. Denier、Opacity、Color、Material、Finish、Lining、Knit、Pattern、Waist/Control、Compression、Season、Occasion、Style、Visual Effect。
5. 每条记录的来源、`source_type`、`is_synthetic`、`confidence`、审核状态和字段级证据。
6. 三类 AI Prompt、AI Generation Notes、Similar Hosiery 和基础 History Nodes。
7. Next.js + PostgreSQL/pgvector + Cloudflare R2 的可部署架构。
8. SEO、版本化发布、数据审计、备份、权限和 API 密钥保护。
9. `/about/sources` 方法论页面，明确说明数据来源和版权边界。

### 2.2 V1 暂不做

以下内容不进入当前开发、数据生产或公开导航：

- 裙子数据库和 `dresses` 表
- 裙子与丝袜的 `best_with`、`works_with`、`avoid_with`、`length_balance` 等关系
- 鞋、包、配饰和 Outfit Graph
- `/looks`
- `/ai-stylist`、`Ask AI Stylist` 和 AI Stylist API
- 公开第三方 API
- Admin Web UI
- 任务队列和实时趋势模块
- 用户账户、保存筛选、社区和用户上传图片
- 医疗级压缩建议

详情页可以保留**通用场景标签**，例如 Office、Formal、Party、Winter，但不把它们写成需要裙子实体才能验证的搭配关系。

## 3. “1 条记录”的定义

> **1 record = 1 个可独立比较的 Hosiery 结构变体，或 1 个 HosieryLab Standard Variant。**

建议唯一性由以下组合决定：

`brand / product_line + construction + top_position + foot_type + denier_nominal`

规则如下：

- 同一产品不同 Denier 是不同 record。
- 同一 record 的不同颜色放在 `record_colorways` 子表中，不重复计算为多条记录。
- 尺码不产生新 record，放入 `extended_attrs` 或品牌尺码字段。
- 同一产品线可通过 `product_line_id` 关联多个 record。
- `hl_code`（如 `HL-000123`）是稳定公开 ID，slug 可变但必须保留 301 重定向。

### 3.1 收录边界

**收录：**

- Sheer 到 Opaque 的细针织腿部服饰
- Footie、Ankle、Crew、Mid-Calf、Knee High
- Over-the-Knee、Thigh High、Stockings、Stay-ups
- Pantyhose / Tights、Footless、Stirrup、Suspender Tights、Bodystocking
- Fishnet、Mesh、Lace、Ribbed、Cable、Openwork
- 有公开结构、材质、颜色或视觉证据的真实 SKU
- 明确标注为 synthetic 的 HosieryLab Standard Variant

**不收录：**

- 普通运动棉袜和与 Hosiery 视觉研究无关的日常袜
- Leg warmer
- 不属于袜类结构的普通 Legging
- 无公开证据、无法稳定归类的产品
- 医疗级压缩产品的诊断、治疗或健康建议

## 4. 首页与导航

### 4.1 V1 导航

`Explore` · `Hosiery` · `Compare` · `History` · `About / Sources`

V1 不在导航中放置尚未实现的 Looks、AI Stylist 或 Dresses。

### 4.2 页面路由

```text
/
/explore
/explore/[dimension]/[value]
/hosiery
/hosiery/[slug]
/compare
/history
/history/[slug]
/about/sources
```

### 4.3 首页信息结构

1. **Header**：HOSIERYLAB、主导航、全局搜索。
2. **Hero — The Experiment**：展示统一腿部 SVG/视觉样本，用 Denier 滑块从 5D 到 100D，直观看到覆盖度变化。
3. **Quick Filters**：
   - Black
   - Skin tones
   - White
   - ≤10D
   - 11–20D
   - 21–39D
   - 40D+
   - Sheer
   - Matte
   - Glossy
   - Patterned
4. **Explore by Length**：使用人体腿部图，点击 Footie 到 Pantyhose/Tights 的长度节点。
5. **Explore by Denier / Opacity**：展示 5D、8D、10D、15D、20D、30D、40D、60D、80D、100D+ 和六类透明度。
6. **Seven Chapters**：Length、Sheer Scale、Color、Fiber & Finish、Pattern & Knit、Details、Season & Occasion。
7. **Featured Comparison**：编辑精选的 One Variable 对比。
8. **Featured / Recently Added**：V1 使用编辑精选，不假装有趋势数据。
9. **History Teaser**：展示 3–5 个有来源的历史节点。
10. **Our Method**：公开 taxonomy、真实 SKU 事实、HosieryLab Standard Variant 和图片版权规则。
11. **Footer**：Sources、Methodology、Field Notes、联系信息。

### 4.4 网站叙事

HosieryLab 的内容不是把 10,000 条记录平铺成图库，而是围绕“实验室”组织内容：

- **One Variable**：一次只改变 Denier、Finish、颜色或长度中的一个变量。
- **Specimen of the Week**：每周深度讲解一条记录。
- **Field Notes**：公开标准化颜色、长度和光线的方法。
- **Misread**：解释常见误解，例如 Denier 不是透明度的唯一决定因素。
- **New in the Lab**：每批发布时显示数量、真实 SKU 与 Standard Variant 比例。
- **Gaps We Are Filling**：公开 taxonomy 尚未覆盖的区域。

## 5. 长度、覆盖范围与结构体系

原先的长度列表混合了长度、结构、支撑方式、腰线和脚部结构。V1 将它们拆成互相独立的输入轴，再由数据库生成 `length_class`、`coverage` 和 `garment_type`，避免同一条记录同时被错误归入多个结构。

### 5.1 原始输入轴

#### Construction

- `separate_legs`：两条分离的腿部袜
- `joined_waist`：两腿在腰部连接的连裤袜/紧身袜
- `suspender_tights`：带吊袜结构的一体款
- `bodystocking`：延伸至身体的连体款

#### Top Position

使用有顺序的人体标记：

`below_ankle < ankle < lower_calf < mid_calf < below_knee < above_knee < mid_thigh < upper_thigh < hip < natural_waist < high_waist < underbust < shoulder`

它表示产品上沿终止的位置，而不是营销名称。

#### Foot Type

- `full_foot`
- `open_toe`
- `stirrup`
- `footless`

#### Support System

- `waistband`
- `silicone_grip`
- `suspender`
- `elastic_welt`
- `body_straps`

### 5.2 对外显示的 Length Class

- `Footie / No-show`：上沿在脚部或脚踝以下
- `Ankle`：脚踝高度
- `Crew`：小腿下部
- `Mid-Calf`：小腿中部
- `Knee High`：膝下
- `Over-the-Knee`：过膝、未到大腿上部
- `Thigh High`：大腿高度
- `Stockings`：通常由吊袜系统固定的 Thigh High 结构
- `Pantyhose / Tights`：连接至腰部的两腿结构
- `Waist High`：上沿至自然腰或臀部以上的腰部覆盖
- `High Waist`：高于自然腰线
- `Footless Tights`：连裤结构但没有完整脚部
- `Stirrup Tights`：脚底带踩脚带
- `Body / Suspender Tights`：连体或带吊袜结构

这些名称保留给用户理解，但数据库中分别映射到 `top_position`、`construction`、`foot_type`、`support_system`。

### 5.3 生成字段

- `length_class`：由 `top_position` 生成。
- `coverage_start`：由 `foot_type` 生成：Full Foot → Toe；Open Toe → Forefoot；Stirrup → Arch；Footless → Ankle。
- `coverage`：`coverage_start → top_position`，例如 `Toe → Upper Thigh`。
- `garment_type`：由 construction + foot_type + top_position + support_system 生成。
- `top_position_ratio`：可选的标准化比例，定义为标准样本中“上沿高度 / 自然腰高度”，不是 V1 默认筛选项。

### 5.4 脚部与顶部细节字段

- `toe_reinforcement`：Sheer Toe、Reinforced Toe
- `toe_seam`：Seamless、Flat Seam、Standard Seam
- `heel_shaping`：Formed Heel、Tube
- `heel_reinforcement`：None、Reinforced、Cuban、French、Other
- `top_band_style`：Plain、Comfort Wide、Lace、Decorative、Cut Edge、None
- `top_band_width_mm`
- `top_band_grip`：None、Silicone Dots、Silicone Strip、Silicone Full
- `top_band_material`
- `back_seam`：None、Seamed、Mock Seam
- `panty_type`：Sheer to Waist、Reinforced Brief、Control Top、Shaping
- `gusset`：Cotton、Self Fabric、None
- `knit_construction`：Circular Knit、Fully Fashioned、Warp Knit、Unknown

### 5.5 关键数据库约束

1. `separate_legs` 的上沿不能超过 Upper Thigh。
2. `joined_waist` 和 `suspender_tights` 的上沿必须在 Hip 至 High Waist 范围。
3. `bodystocking` 必须使用 Body Straps，并延伸至 Underbust 或 Shoulder。
4. Silicone Grip 必须存在相应的 Top Band Grip。
5. Full Foot 才能填写 Toe Reinforcement 和 Toe Seam。
6. Stirrup 与 Footless 不能被归为 Footie。
7. Panty Type 与 Gusset 只用于连裤、吊袜连裤或 Bodystocking。
8. Faux Thigh-High 的物理结构仍按实际 `joined_waist` 记录，假大腿袜效果放到 `motif`。

所有可筛选字段必须是有类型、有索引、有约束的列或标准化子表，不能把一级筛选字段塞进 JSONB。

## 6. 其他筛选维度

### 6.1 Denier 与透明度

- `denier_nominal`：整数，可为空。
- `denier_basis`：`stated`、`estimated`、`not_applicable`。
- `opacity_class`：单独保存，不能简单从 Denier 自动决定。

标准透明度：

- `ultra_sheer`：通常 ≤10D
- `sheer`：通常 11–20D
- `semi_sheer`：通常 21–35D
- `semi_opaque`：通常 36–59D
- `opaque`：通常 60–99D
- `heavy_opaque`：通常 ≥100D
- `open_structure`：Fishnet、Mesh、Openwork 等，不强行使用 Denier 阶梯

与默认区间相差一个等级可以发出警告；相差两个等级必须补充字段证据，否则禁止发布。

### 6.2 颜色

颜色数据使用 `record_colorways` 子表，保存：

- `brand_color_name`：品牌原始色名，作为事实保留
- `color_family`
- `color_shade`
- `hex`
- `hex_basis`：`measured_owned_photo`、`brand_stated`、`editor_estimate`
- `secondary_families`
- `is_primary`

颜色家族：

`black`、`skin_tone`、`white`、`cream`、`grey`、`brown`、`navy`、`blue`、`red`、`burgundy`、`pink`、`purple`、`green`、`yellow`、`multi`

Skin tones 的标准 shade：

`porcelain`、`ivory`、`light_beige`、`beige`、`natural`、`honey`、`tan`、`bronze`、`deep`、`espresso`

“NUDE”作为搜索 alias 保留，但对外显示优先使用 Skin tones。Metallic 归入 `finish = shimmer` 或 `metallic_yarn`，不作为颜色家族。

### 6.3 材质

使用 `record_fibers` 子表：

- Nylon / Polyamide
- Elastane
- Cotton
- Wool
- Cashmere
- Silk
- Viscose
- Polyester
- Metallic Yarn / Lurex
- Other

每条记录的纤维百分比合计必须为 100%。Blend 是由多个纤维自动推导的结果，Recycled 是单独的 `is_recycled` 标记。

### 6.4 Finish、Lining、Knit 与 Pattern

- `finish`：Matte、Semi-matte、Satin、Glossy、High-shine、Wet-look、Shimmer
- `lining`：None、Brushed、Fleece、Faux Translucent Fleece
- `knit_texture`：Plain、Ribbed、Cable、Fishnet、Mesh、Lace、Openwork、Jacquard
- `motif`：None、Dot、Stripe、Argyle、Floral、Animal、Logo、Geometric、Faux Thigh High、Other

Finish、编织结构和图案彼此分开。例如一条袜子可以同时是 Ribbed + Stripe；顶边蕾丝是 `top_band_style = lace`，全身蕾丝才是 `knit_texture = lace`。

### 6.5 Waist / Control

- Regular / High Waist → 由 `top_position` 表达
- Comfort Waist → `top_band_style = comfort_wide`
- Control Top / Shaping → `panty_type`
- Crotch Panel → `gusset`
- Flat Seam → `toe_seam` 或 `extended_attrs.flat_body_seams`

### 6.6 Compression

- `compression_class`：Not Stated、None、Light、Medium、Firm、Medical
- `compression_mmhg_min/max` 只有在品牌公开时才能填写，并且必须有字段证据。
- 不推测压力等级，不提供诊断、治疗或健康建议。

### 6.7 编辑标签

以下标签允许多选，但要标记为 HosieryLab 编辑判断，而不是品牌事实：

- Season：Spring、Summer、Autumn、Winter、All-season
- Occasion：Everyday、Office、Formal、Party、Bridal、Performance、Outdoor、Lounge、Editorial
- Style：Minimal、Classic、Romantic、Preppy、Gothic、Punk、Street、Lingerie、Avant-garde、Vintage、Sporty
- Visual Effect：Leg-lengthening、Skin-blurring、Sheen、Sculpting、Texture、Graphic Contrast、Layering、Statement

## 7. 数据模型与来源体系

### 7.1 V1 核心表

- `product_lines`
- `hosiery_records`
- `record_colorways`
- `record_fibers`
- `record_tags`
- `sources`
- `record_sources`
- `field_evidence`
- `assets`
- `record_revisions`
- `audit_log`
- `import_batches`
- `publish_releases`
- `history_nodes`
- `history_node_links`
- `record_embeddings`
- `vocab`
- `color_families`
- `color_shades`
- `fibers`
- `search_aliases`

V1 不建立 `dresses`、`shoes`、`accessories` 或跨品类关系表。

### 7.2 Provenance 两层结构

#### Record 层

- `origin`：`real_sku` 或 `standard_variant`
- `is_synthetic`：record 是否为 HosieryLab 标准化变体
- 至少一个 `record_sources`，角色为 `primary`
- `confidence`：`high`、`medium`、`low`
- `status`
- `reviewer_id`、`reviewed_at`

#### Field 层

`field_evidence` 保存：

- `field_path`
- `source_id`
- `confidence`
- `evidence_note`

真实 SKU 的核心字段必须有字段证据：`top_position`、`foot_type`、`denier_nominal`（当 basis 为 stated 时）、纤维组成、品牌色名。压缩值和严重偏离 Denier 默认透明度的字段也必须有证据。

### 7.3 Source Type

允许的 `source_type`：

- `industry_taxonomy`
- `brand_sku`
- `retailer_sku`
- `museum_archive`
- `editorial_reference`
- `expert_review`
- `hosierylab_standard_variant`
- `hosierylab_visual_reference`

数据来源策略：

1. 可以使用行业公开 taxonomy，作为分类语言和定义参考。
2. 可以记录真实 SKU 的事实，例如 Denier、成分、结构、品牌颜色名和产品编码。
3. 可以制作 HosieryLab Standard Variant，但必须明确标记为 synthetic。
4. 图片只能使用自有资产、明确授权资产或代码生成的自有 SVG/图表。
5. 不复制同行图片、文案、广告语言或数据库结构。
6. 公开来源快照仅放在 R2 private bucket，作为内部证据，不对外服务。
7. 描述必须是 HosieryLab 原创表达，CI 对来源快照做 n-gram 相似度检查。
8. 记录品牌名称只用于识别事实，不复制 logo 或广告设计。

### 7.4 状态机

```text
draft → in_review → changes_requested → draft
                     ↓
                  approved → published → deprecated
```

`approved` 和 `published` 必须有 reviewer，且 reviewer 不能是创建者。废弃记录需要 `deprecated_reason`，可选 `replaced_by_id`。

## 8. 详情页设计

### 8.1 页面模块

1. **Hero / Visual Reference**：优先使用由数据生成的腿部 SVG、长度示意、颜色色卡和关键标签；真实照片为可选项。
2. **Specifications**：Structure、Length、Coverage、Denier、Opacity、Color、Material、Finish、Lining、Knit、Pattern、Waist、Compression、Toe、Heel、Top Band。
3. **Visual Profile**：透明度、光泽、纹理、覆盖效果、颜色表现和光线说明。
4. **Description**：由结构化字段生成初稿，再由编辑审核，禁止复制来源文案。
5. **History & Evolution**：显示匹配的历史节点和材料/技术谱系。
6. **Cultural Context**：仅在 History Node 有来源时显示，不为每条 record 强行编造背景。
7. **三类 AI Prompt**：Product、Editorial、Outfit/Styling。
8. **AI Generation Notes**：长度、脚部、透明度、缝线、顶边和灯光约束。
9. **Compare**：加入最多 4 条记录的比较工作台。
10. **Similar Hosiery**：结构相近、视觉相近、编辑标签相近三组结果，由查询评分生成。
11. **Provenance Panel**：Real SKU / HL Standard、synthetic 标记、置信度、来源、审核日期和 data version。

V1 不显示需要裙子或鞋实体的 Best With / Avoid With 关系，也不显示 Ask AI Stylist。

### 8.2 三类 Prompt

Prompt 由模板根据结构化字段 deterministic 生成，V1 不调用 LLM 自动写 Prompt。

- **Product Prompt**：统一背景、腿部结构、长度、透明度、颜色和材质。
- **Editorial Prompt**：使用原创摄影方向、材质和视觉效果描述。
- **Outfit / Styling Prompt**：只描述通用服装场景，例如“膝下长度的 A-line skirt”，不引用不存在的裙子实体、具体库存或品牌广告语。

每个 Prompt 保存：

`prompt_text`、`negative_prompt`、`model_notes`、`version`、`template_id`、`template_version`、`facts_hash`、`created_by`、`source_type`

当事实字段变化时，`facts_hash` 变化并重新生成 Prompt。

## 9. History Nodes

History Nodes 是可筛选、可引用、可连接的历史节点，不是没有来源的长文章。

### 9.1 节点类型

`Material`、`Technique`、`Garment Form`、`Brand Milestone`、`Cultural Moment`、`Fashion Era`、`Manufacturing`、`Retail`、`Media`

### 9.2 节点字段

- `title`、`slug`
- `year_start`、`year_end`
- `date_precision`：Year、Decade、Circa
- `region`
- `people_or_organizations`
- `summary`、`long_form_content`
- `match_criteria`：按属性自动匹配 Hosiery records
- `pinned_record_ids`：少量人工置顶关联
- `source_ids`
- `confidence`、`review_status`
- `predecessor_ids`、`successor_ids`

V1 建议 15–25 个节点，每个节点至少有一个 `museum_archive` 或 `editorial_reference` 来源。`/history` 使用带过滤的时间线列表，详情页显示 2–3 个相关节点。

## 10. 搜索、筛选与 Compare

### 10.1 URL 筛选

```text
/hosiery?len=thigh_high,knee_high&type=stay_ups&rise=high_waist&foot=full_foot&den=10-20&op=sheer&color=black&fiber=wool&finish=matte&knit=fishnet&motif=dot&support=silicone_grip&seam=seamed&q=...&sort=denier_asc&page=2
```

规则：

- 同一维度内部是 OR。
- 不同维度之间是 AND。
- 参数和值按固定顺序序列化，保证 canonical URL、缓存和分享稳定。
- Facet 显示应用其他筛选后的数量。
- Sort：relevance、denier ascending/descending、newest、name。

### 10.2 搜索解析

1. `search_aliases` 将 `15d`、`nude`、`hold ups`、`seamed` 等 token 转成筛选 chip。
2. 剩余文本使用 PostgreSQL Full-text Search。
3. `pg_trgm` 处理拼写误差和品牌/产品线名称。
4. pgvector 只作为零结果时的可选 semantic fallback。

### 10.3 Compare

- 最多比较 4 条 record。
- URL：`/compare?ids=HL-000012,HL-000045`。
- 选择状态保存在 localStorage。
- 对比表高亮不同字段。
- 并排显示 Length/Coverage SVG、颜色、Denier、Opacity、Finish、Knit、Toe、Heel 和 Top Band。
- 提供预设比较：Sheer Spectrum、Matte vs Gloss、Same Denier Different Look、Foot Type Comparison。

## 11. 技术架构

### 11.1 推荐技术

| 层 | V1 选择 |
|---|---|
| Web | Next.js App Router、TypeScript、Tailwind |
| DB | PostgreSQL 16+、pgvector、pg_trgm |
| Query | Kysely，数据库迁移使用 SQL；DDL 是 schema 真相 |
| Validation | Zod，用于 YAML import、URL filter 和 API 边界 |
| Image | sharp，生成 WebP/AVIF 和多尺寸缩略图 |
| Object Storage | Cloudflare R2，public/private 两个 bucket |
| Hosting | Vercel；后续可评估 Cloudflare Workers + OpenNext |
| Data | private `hosierylab-data` repo，以 YAML data-as-code 管理 |
| CI | GitHub Actions：lint、typecheck、test、gitleaks、validate、QC |

### 11.2 两个仓库

```text
hosierylab-web   # 前端和服务端代码，不含 secret 和未发布数据
hosierylab-data  # private：YAML records、sources、prompt templates、审核变更
```

V1 使用 PR 审核和 CLI 导入，暂不开发 Admin Web UI。数据从 draft 到 publish 的每一步都能从 Git history、`record_revisions`、`audit_log` 和 `import_batches` 追踪。

### 11.3 数据库权限

- `hl_web_ro`：只能读公开 view `v_public_*`。
- `hl_importer`：只给 CI 和授权编辑器，用于导入和发布。
- `hl_admin`：用于 migration 和运维。
- Web 永远不能读 draft、source snapshot key 或 reviewer 内部备注。

### 11.4 pgvector

`record_embeddings` 独立存放，建议使用 HNSW cosine index。embedding 由离线脚本根据 `search_doc` 生成；当 `content_hash` 未变化时跳过重复计算。V1 可通过 `EMBEDDINGS_ENABLED` 关闭。

## 12. Cloudflare R2 设计

使用两个 bucket：

- `hosierylab-public`：已审核、已处理、可公开访问的图片和导出资源。
- `hosierylab-private`：原图、来源快照、许可证证明、内部导出和审核材料。

建议目录：

```text
public/
  assets/{asset_id}/{sha256}/w400.webp
  assets/{asset_id}/{sha256}/w800.webp
  assets/{asset_id}/{sha256}/w1600.webp
  assets/{asset_id}/{sha256}/original.avif

private/
  originals/{asset_id}/{sha256}/original.ext
  source-snapshots/{source_id}/{retrieved_at}.html.gz
  license-evidence/{asset_id}/{evidence_id}.json
  exports/{dataset}/{version}/
```

原则：

- 以 `asset_id + hash` 作为不可变 key，便于长期缓存。
- R2 不保存 prompts 的第二份 JSON；Prompt 只在 PostgreSQL 中保存。
- 公开 bucket 不放来源快照和未审核原图。
- 上传前检查 MIME、扩展名、文件大小，使用 sharp 解码并移除 EXIF。
- 网站只需要公开图片域名，不需要 R2 secret。

## 13. Data-as-code 与生产流程

### 13.1 目录

```text
datasets/
  hosiery/
    HL-000001.yaml
    HL-000002.yaml
sources/
prompt-templates/
  product.v1.txt
  editorial.v1.txt
  outfit.v1.txt
schemas/
  record.ts
scripts/
  snapshot-source.ts
  validate.ts
  import.ts
  gen-prompts.ts
  content-check.ts
  qc.ts
  publish.ts
  upload-assets.ts
  embed.ts
  coverage-report.ts
```

### 13.2 CLI 流程

```text
snapshot-source
  → validate
  → import
  → gen-prompts
  → content-check
  → qc
  → review / approve
  → upload-assets
  → publish
  → revalidate
```

每条记录的导入都在 transaction 中完成；失败时返回具体 constraint 名称。发布只能处理 QC 无 blocking issue 且已 approved 的记录。

## 14. 100 → 500 → 1,000 → 10,000

### A：100 条验证集

目标是验证 taxonomy、长度映射、字段定义、SVG 视觉和数据管线。100 条必须覆盖：

- 全部主要 Length Class
- 5–200D 的主要透明度区间
- Black、Skin tones、White、彩色和 Multi
- Nylon/Polyamide、Elastane、Cotton、Wool、Silk、Metallic 等主要材质
- Full Foot、Open Toe、Footless、Stirrup
- Stay-up、Stockings、Pantyhose、Fishnet、Lace、Ribbed、Bodystocking
- 至少 10 条最容易混淆的边界案例

通过条件：100 条 `status = published`，无 blocking QC，至少一名领域 reviewer 审核且 reviewer ≠ creator。

### B：500 条 MVP

- 扩展真实 SKU 和公开 taxonomy 来源。
- 完成 SEO 聚合页、History Nodes 和 One Variable Compare。
- 去重率低于 1%。
- 真实 SKU 的颜色测量和图片许可覆盖率达到既定门槛。

### C：1,000 条规模化

- 增加 Admin UI、批量导入和重复检测。
- embedding 与 Similar Hosiery 自动化。
- QC 自动覆盖全部规则，随机抽查至少 10%。
- 开始建立行为分析，但只发布真实 analytics 产生的 Featured 数据。

### D：10,000 条数据库

- 按长度、颜色、Denier、材质和场景平衡分批发布。
- 每批保留 data version、来源快照和变更记录。
- low-confidence 和 synthetic 记录在发布前强制复审。
- 对每批公布 real SKU / standard variant 比例和覆盖空白。

## 15. QC 体系

### 15.1 数据一致性

- Length Class 与 Top Position 自动一致。
- Coverage Start 与 Foot Type 自动一致。
- Garment Type 由结构自动生成。
- Construction、Support、Foot、Toe、Heel、Top Band 组合满足 DB constraints。
- Denier 与 Opacity 偏差符合规则。
- 纤维百分比合计为 100%。
- Color Shade 属于对应 Color Family。
- Standard Variant 不得伪装成真实品牌 SKU。

### 15.2 来源与内容

- 真实 SKU 核心字段有 `field_evidence`。
- URL 来源有 retrieved_at、标题、发布者和快照 hash。
- 来源快照不公开。
- 描述与来源快照做 n-gram 重复检查。
- Prompt 不包含品牌广告 slogan 或未授权文案。
- 图片有自有/授权状态、MIME、hash、尺寸和 EXIF 检查。

### 15.3 发布与审核

- reviewer 不得与 creator 相同。
- 所有 blocking issue 清零后才能 publish。
- 旧 slug 保留 301。
- 每次发布关联 `publish_release` 和 data version。
- 低置信度记录必须在更高数量阶段再次复核。

## 16. SEO 与自动发布

### 16.1 Record SEO

每条 published record 生成：

- 稳定 slug
- title
- meta description
- canonical
- Open Graph
- JSON-LD
- 可访问的长度、颜色、Denier 和来源标记

真实 SKU 使用适合事实记录的 `Product` JSON-LD，不生成虚假的价格和 offers。Standard Variant 使用 `DefinedTerm` 或 `CreativeWork`，不伪装成零售产品。

### 16.2 聚合页 SEO

只允许以下单维聚合页进入索引，并且至少有 5 条记录：

- `/explore/length/*`
- `/explore/type/*`
- `/explore/opacity/*`
- `/explore/color/*`
- `/explore/fiber/*`

其他多维排列组合默认 `noindex,follow`，避免低价值页面膨胀。

### 16.3 发布链路

```text
Merge PR
  → CI validate + QC + secret scan
  → import
  → publish approved records
  → update sitemap / JSON-LD
  → server-side revalidate
  → crawl changed pages
  → dead-link check
```

V1 生成 sitemap；图片 sitemap 只包含真实可公开图片。RSS、趋势榜和行为驱动推荐后置。

## 17. 安全与 API 密钥原则

- `DATABASE_URL`、R2 token、`REVALIDATE_SECRET`、embedding key 只放服务端环境变量或 CI secret。
- 不使用 `NEXT_PUBLIC_` 暴露任何密钥。
- `server-only` 隔离数据库和导入模块。
- pre-commit 与 CI 运行 gitleaks。
- 日志自动遮盖 token、key、password 和带凭证的 URL。
- 数据库启用 PITR；R2 private bucket 开启版本保护和恢复演练。
- 网站设置 CSP、`X-Content-Type-Options`、`Referrer-Policy` 和图片域名白名单。
- 所有管理写入产生 audit log。
- 不把密钥写入 Markdown、YAML、Prompt、图片 URL、构建产物或客户端 bundle。

## 18. 开发里程碑

按 1 名全栈开发者、1 名领域 reviewer、1 名数据编辑的配置，V1 预计 6–7 周：

| 里程碑 | 时间 | 内容 | 退出条件 |
|---|---:|---|---|
| M0 初始化 | 2–3 天 | 两个 repo、CI、Neon/PostgreSQL、R2、Vercel、secret、DB roles | 空仓库 CI 通过，web 只读连接成功 |
| M1 Taxonomy + Schema | 4–5 天 | SQL migration、enum、vocab、Zod、20 条 pilot | reviewer 通过字段定义，20 条 YAML pass |
| M2 数据管线 | 5 天 | snapshot、validate、import、prompt、QC、publish、asset upload | 20 条完成 draft→published |
| M3 20→100 | 2–3 周 | 覆盖配额、修订 taxonomy、数据审核 | 100 条验证记录通过 |
| M4 Explore / Filter / Search | 6–7 天 | listing、facet、URL filter、parser、sort、分页 | 全部一级筛选工作，p95 TTFB <500ms（100 条数据） |
| M5 Detail / Compare / Home | 6–7 天 | SVG、详情页、Compare、首页 | 100 个详情页可渲染，Lighthouse 目标 ≥90 |
| M6 SEO / History / Sources | 3–4 天 | JSON-LD、sitemap、History、Sources、revalidate | sitemap 和结构化数据通过检查 |
| M7 Hardening / Launch | 3 天 | restore、secret、CSP、链接、smoke test | DoD 全部通过，发布 v1.0.0/data-v1 |

## 19. Narrative 与视觉系统

### 19.1 语言风格

五个关键词：

- **Precise**：使用数字和标准术语。
- **Curious**：用问题引导探索。
- **Refined**：克制、简洁、不夸大。
- **Transparent**：明确来源和 synthetic 状态。
- **Useful**：每一段都帮助用户理解或比较。

禁止：

- 色情化、挑逗化的身体描述。
- “最好”“最受欢迎”等没有证据的绝对表达。
- 医疗级压缩的健康建议。
- 改写品牌广告语或复制同行文案。

### 19.2 视觉语言

- 统一腿部 SVG 是 V1 的主视觉资产，确保 100% 可控和可批量生成。
- 背景接近中性灰或暖白，避免背景色干扰颜色判断。
- 数据字段使用 monospace，编辑标题使用克制的 serif。
- UI 近似单色，让丝袜颜色和纹理成为主角。
- 动效只表现变量变化，例如 Denier slider、Length morph、Compare highlight。
- 每张 card 显示 `HL code`、来源 badge、置信度和核心属性。

### 19.3 七个内容章节

1. **Length: From Toe to Waist**
2. **The Sheer Scale**
3. **Color, Named and Measured**
4. **Fiber & Finish**
5. **Pattern & Knit**
6. **The Details**
7. **Season & Occasion**

## 20. V1 完成标准

V1 只有在以下条件全部满足时才算完成：

1. 首页、导航、搜索、组合筛选、详情页、Compare、History、Sources 在 production 可用。
2. 至少 100 条已验证 record 发布，且数量配额和来源覆盖达标。
3. Construction、Top Position、Length Class、Coverage、Garment Type、Foot、Toe、Heel、Top Band、Support 均可查询且有约束。
4. 每条 record 有 origin、`is_synthetic`、primary source、confidence、status、reviewer；真实 SKU 有字段级证据。
5. 三类 Prompt 和 AI Generation Notes 对全部已发布 record 可生成。
6. History Nodes 至少 15–25 个且有来源。
7. Next.js + PostgreSQL/pgvector + R2 双 bucket 可部署，备份恢复已演练。
8. SEO、版本化 publish、audit、secret scan、CSP 和死链检查通过。
9. `/about/sources` 明确声明：使用公开 taxonomy、真实 SKU 事实、HosieryLab Standard Variant 和自有/授权资产，不复制同行图片、文案或数据库。

## 21. V1 之后的方向

当 Hosiery Database 达到稳定的 10,000 条、taxonomy 冻结且 provenance 体系成熟后，再按独立项目评估：

1. 裙子数据库与 Hosiery ↔ Dress 关系。
2. 鞋、包和配饰数据库。
3. Outfit Graph 与 Fashion Knowledge Graph。
4. 可引用实体、证据和置信度的 AI Virtual Stylist。

这些内容不影响 V1 的交付边界，当前开发只围绕 Hosiery 数据和视觉知识完成。
