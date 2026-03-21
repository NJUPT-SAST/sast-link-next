export async function initMocks() {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "true") return;

  const { worker } = await import("./browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });
}
