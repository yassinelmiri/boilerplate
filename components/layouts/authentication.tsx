import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"

import { Logo } from "@/components/brand/logo"
import { Stack, Center, Inline, Spacer, Box } from "@/components/design-system/layout"
import { Blockquote, ExternalLink } from "@/components/design-system/typography"
import { BaseLoader } from "@/components/design-system/loader"
import { FramedContainer } from "@/components/containers/framed"
import { FloatingPaths } from "@/components/ui/floating-paths"
import { Separator } from "@/components/ui/separator"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="relative min-h-dvh lg:grid lg:h-screen lg:grid-cols-2 lg:overflow-hidden">

      {/* ── Left panel ──────────────────────────────────── */}
      <Stack className="relative hidden h-full border-r border-border bg-secondary/20 p-10 lg:flex">
        {/* Animated background */}
        <Box className="absolute inset-0 overflow-hidden">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </Box>

        {/* Fade to background at bottom */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

        {/* Logo */}
        <Logo className="relative z-10" />

        <Spacer />

        {/* Testimonial */}
        <Box className="relative z-10">
          <Blockquote className="space-y-2 border-none pl-0 not-italic">
            <p className="text-xl leading-relaxed">
              &ldquo;Agency forms made easy.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold text-foreground">
              ~ Youssef
            </footer>
          </Blockquote>
        </Box>
      </Stack>

      {/* ── Right panel ─────────────────────────────────── */}
      <Stack className="relative min-h-dvh lg:h-full">
        <Center className="w-full flex-1 px-4 py-12 sm:px-8">
          <Stack gap="md" className="w-full max-w-md">

            {/* Form area */}
            <FramedContainer>
              <Suspense
                fallback={
                  <BaseLoader
                    variant="inline"
                    className="py-16"
                  />
                }
              >
                {children}
              </Suspense>
            </FramedContainer>

            {/* Legal links */}
            <Inline gap="sm" justify="center" align="center" className="w-full">
              <ExternalLink href="/legal/privacy">Privacy policy</ExternalLink>
              <Separator orientation="vertical" />
              <ExternalLink href="/legal/terms">Terms of service</ExternalLink>
            </Inline>

          </Stack>
        </Center>
      </Stack>

    </main>
  )
}
