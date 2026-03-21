"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUserListStore } from "@/store/use-user-list-store";
import { getUserInfo } from "@/lib/api/user";
import { setToken } from "@/lib/token";
import { message } from "@/lib/message";
import { BackLayout } from "@/components/layout/back-layout";
import { AccountPanel } from "@/components/account/account-panel";
import { Footer } from "@/components/layout/footer";
import { DotLoading } from "@/components/ui/dot-loading";

export default function Home() {
  const router = useRouter();
  const { accounts, removeAccount } = useUserListStore();
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accounts.length === 0) {
      router.replace("/login");
    }
  }, [accounts, router]);

  const handleLogin = () => {
    if (!accounts[selected]) return;

    setLoading(true);
    setToken(accounts[selected].token);

    getUserInfo()
      .then((res) => {
        if (res.data.Success) {
          router.replace("/home");
          return;
        }
        message.error("该用户的验证消息已过期，请重新登录!");
      })
      .catch(() => {
        message.error("网络错误");
      })
      .finally(() => setLoading(false));
  };

  if (accounts.length === 0) return null;

  return (
    <>
      <BackLayout type="green" />
      <main className="flex min-h-screen flex-col items-center">
        <div className="page-title">{"<sast link>"}</div>
        <div className="global-container">
          <AccountPanel
            accounts={accounts}
            selectedIndex={selected}
            onSelect={setSelected}
            onRemove={removeAccount}
          />
          <Footer>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex h-[42px] w-[314px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-xl font-semibold text-white disabled:opacity-50"
            >
              {loading ? <DotLoading /> : "登录"}
            </button>
            <Link
              href="/login"
              className="text-sm text-[#1c1f23] hover:underline"
            >
              使用其他账号
            </Link>
          </Footer>
        </div>
      </main>
    </>
  );
}
