# SAST Link Next

这是 SAST Link 账户系统当前的 Next.js 实现仓库。它已经不是一个通用 starter 模板，而是包含了已迁移的登录、注册、重置密码、账号切换、主页、资料编辑、头像裁剪上传、Jest 测试和 GitHub Actions 工作流的实际业务项目。

[English Documentation](./README.md)

## 项目当前能力

- 提供游客侧登录、注册、重置密码和 OAuth 回调流程。
- 提供用户侧主页概览、资料侧边栏、资料编辑、头像裁剪上传和安全设置入口。
- 当前以 Web 运行时（`pnpm dev`）和静态导出构建（`pnpm build`）为主。
- 默认通过 `NEXT_PUBLIC_API_BASE_URL` 访问现有 SAST Link 后端，必要时可通过 MSW 进行本地 mock。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript 严格模式
- Tailwind CSS v4
- shadcn/ui + Radix
- Zustand
- SWR
- Axios
- React Hook Form
- Jest 30 + Testing Library + MSW

## 当前产品路由

### 游客路由

- `/` 账号切换与快速登录入口
- `/login` 两步登录流程
- `/register` 四步注册流程
- `/reset` 四步密码重置流程
- `/callback/feishu` 飞书 OAuth 回调
- `/callback/github` GitHub OAuth 回调

### 登录后路由

- `/home` 主页概览、快捷操作和常用应用入口
- `/home/edit` 资料编辑与头像裁剪上传
- `/home/edit/safety` 安全设置页

### 布局与鉴权

- `app/(tourist)/layout.tsx` 为未登录页面提供统一背景布局。
- `app/(user)/layout.tsx` 在本地没有 token 时跳转到 `/login`。
- `app/(user)/home/layout.tsx` 负责拉取资料并组合顶部栏与侧边面板。

## 目录结构

```text
sast-link-next/
├── app/                         # App Router 路由、布局、providers、页面测试
│   ├── page.tsx                 # 根页账号切换入口
│   ├── providers.tsx            # SWR 配置、MSW 启动、全局消息面板
│   ├── (tourist)/               # 登录 / 注册 / 重置密码 / OAuth 回调
│   └── (user)/                  # 登录后主页与编辑流程
├── components/
│   ├── account/                 # 账号切换 UI
│   ├── animation/               # 页面动效
│   ├── auth/                    # 认证复用组件
│   ├── feedback/                # 全局消息面板
│   ├── icons/                   # Logo 与品牌图标
│   ├── layout/                  # 背景、页脚、顶部栏
│   ├── navigation/              # 返回按钮
│   ├── profile/                 # 资料绑定项
│   └── ui/                      # 基础 UI 组件
├── hooks/
│   └── use-fetch-profile.ts     # 获取并同步当前用户资料
├── lib/
│   ├── api/                     # Axios client 与 auth/user/oauth API 封装
│   ├── constants/               # 常量
│   ├── validations/             # 表单校验规则
│   ├── token.ts                 # token 持久化
│   └── message.ts               # 全局提示封装
├── mocks/                       # NEXT_PUBLIC_API_MOCKING=true 时启用的 MSW
├── public/                      # 静态资源和 MSW worker
├── store/                       # Zustand stores
├── tests/                       # 共享测试辅助文件 / 更高层测试
├── .github/workflows/           # CI/CD、测试、部署、发布工作流
├── TESTING.md                   # 测试说明
├── CI_CD.md                     # GitHub Actions 说明
└── CONTRIBUTING.md              # 协作贡献说明
```

## 关键运行时模块

### Zustand 状态

- `store/use-auth-store.ts`：当前登录用户、login ticket、redirect、logout。
- `store/use-user-list-store.ts`：根页记住的账号列表与切换逻辑。
- `store/use-user-profile-store.ts`：主页与编辑页共享的用户资料。
- `store/use-panel-store.ts`：主页侧边面板开关状态。

### API 封装

- `lib/api/client.ts`：读取 `NEXT_PUBLIC_API_BASE_URL`，并自动附带 `Token` 请求头。
- `lib/api/auth.ts`：账号校验、邮件发送、验证码校验、注册、重置密码、OAuth 回调。
- `lib/api/user.ts`：登录、登出、资料获取/修改、头像上传、绑定状态查询。

### 构建集成

- `next.config.ts` 使用 `output: "export"`，使 `pnpm build` 生成 `out/`。

## 开发前置要求

### 所有开发都需要

- Node.js 20 或更高版本
- pnpm，建议与 CI 对齐使用 pnpm 10

## 安装与环境变量

```bash
pnpm install
```

本地环境变量示例：

```env
NEXT_PUBLIC_API_BASE_URL=http://118.25.23.101:8081/api/v1
NEXT_PUBLIC_API_MOCKING=false
```

说明：

- `.env*` 已被 `.gitignore` 忽略。
- 将 `NEXT_PUBLIC_API_MOCKING=true` 后，`app/providers.tsx` 会动态初始化 MSW。
- 当前 `.env.example` 只记录了这两个公开变量。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Next.js Web 开发服务器 |
| `pnpm build` | 生成 `out/` 静态导出 |
| `pnpm start` | 启动 Next.js 生产服务器 |
| `pnpm lint` | 运行 ESLint |
| `pnpm test` | 运行 Jest 测试 |
| `pnpm test:watch` | 监听模式运行 Jest |
| `pnpm test:coverage` | 生成覆盖率报告 |

## 推荐本地流程

### 只做 Web 开发

```bash
pnpm dev
```

然后重点验证：

- `/`
- `/login`
- `/register`
- `/reset`
- `/home`

### 提交前验证

```bash
pnpm lint
pnpm test
pnpm build
```

## 测试现状

仓库已经配置并在使用 Jest。测试主要分布在 `app/`、`components/`、`hooks/`、`lib/`、`store/` 下，与源码同目录维护。

当前仓库中的代表性测试包括：

- `app/page.test.tsx`
- `app/(tourist)/login/page.test.tsx`
- `app/(user)/home/homepage.test.tsx`
- `components/layout/top-bar.test.tsx`
- `hooks/use-fetch-profile.test.tsx`
- `lib/api/auth.test.ts`
- `store/use-auth-store.test.ts`

详见 [TESTING.md](./TESTING.md)。

## CI/CD 现状

仓库已经有完整的 GitHub Actions 配置：

- `ci.yml` 在 `master` 与 `develop` 的 push / PR 上编排质量检查和测试。
- `quality.yml` 执行 lint、`tsc --noEmit`、`pnpm audit`、`pnpm outdated`。
- `test.yml` 执行 `pnpm test:coverage`、上传测试与覆盖率产物，并执行 `pnpm build`。
- `deploy.yml` 已存在，但默认关闭。
- `release.yml` 在推送 `v*` tag 时创建 draft GitHub Release。

详见 [CI_CD.md](./CI_CD.md)。

## 与当前实现相关的说明

- `package.json` 里的 npm 包名目前仍是 `react-quick-starter`，但应用界面、路由和页面 metadata 已经是 SAST Link 语义。
- `app/layout.tsx` 当前 metadata 为 `title: "SAST Link"`、`description: "OAuth of SAST"`。

## 相关文档

- [README.md](./README.md)
- [TESTING.md](./TESTING.md)
- [CI_CD.md](./CI_CD.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [AGENTS.md](./AGENTS.md)
