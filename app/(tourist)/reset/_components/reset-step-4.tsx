"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { Footer } from "@/components/layout/footer";

export default function ResetStep4() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-between px-8 pt-10">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-green-100"
        >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Check size={64} className="text-green-600" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <span className="text-2xl font-semibold">密码重置成功</span>
      </div>

      <Footer>
        <Link
          href="/login"
          className="flex items-center gap-2 text-lg font-semibold text-[#1c1f23] hover:underline"
        >
          前往登录界面
          <ArrowRight size={20} />
        </Link>
      </Footer>
    </div>
  );
}
