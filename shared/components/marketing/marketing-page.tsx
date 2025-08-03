"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { CheckCircle2, NotebookPen, Timer, BarChart3, Hand } from "lucide-react";

export default function MarketingPage() {
  const pillars = [
    {
      icon: NotebookPen,
      title: "Plan",
      desc: "Turn priorities into a simple daily plan. Define the few outcomes that matter and the next concrete actions.",
    },
    {
      icon: Timer,
      title: "Track",
      desc: "Log focused work blocks as you go. Create a truthful record that respects your attention budget.",
    },
    {
      icon: BarChart3,
      title: "Analyze",
      desc: "Review patterns, spot bottlenecks, and recalibrate your system weekly with clear, visual insights.",
    },
  ];

  const reasonsManual = [
    "Intent beats automation: deciding creates commitment.",
    "Friction is a feature: a tiny pause prevents busywork.",
    "Accuracy over guesses: sensors can't see context or quality.",
    "Privacy by default: your data stays yours.",
  ];

  return (
    <main className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <section className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_500px_at_80%_-10%,theme(colors.primary/15),transparent),radial-gradient(900px_500px_at_0%_110%,theme(colors.pink.500/12),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] bg-[conic-gradient(from_140deg_at_50%_50%,theme(colors.purple.500/8),transparent_25%)]"
        />
        <div className="mx-auto grid items-center gap-10 md:grid-cols-2">
          <div className="text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Plan with intent. Build momentum.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-muted-foreground mt-6 max-w-xl text-xl"
            >
              Graft is a simple planning and time system for focused work. Designed for individuals who value clarity over clutter.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button size="lg" className="px-8 py-3 text-lg" asChild>
                <a href="/sign-in">Create your free account</a>
              </Button>
              <Button variant="ghost" size="lg" className="px-0 text-lg underline-offset-4 hover:underline" asChild>
                <a href="#use-cases">Best use cases</a>
              </Button>
            </motion.div>
            <div className="text-muted-foreground mt-6 flex items-center gap-3 text-sm">
              <span>Try it in minutes</span>
              <span>•</span>
              <span>No trackers, your data stays yours</span>
            </div>
          </div>
          <div className="relative">
            <div className="from-primary/10 to-pink-500/10 absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-br blur-xl" />
            <Card className="border-muted/50 bg-background/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">Today at a glance</CardTitle>
                <CardDescription>Outcomes, focus blocks, and notes—kept intentionally small.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="use-cases" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="text-foreground text-3xl font-bold sm:text-4xl">Best use cases</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
            Proven techniques that pair well with Graft to keep you focused and energized.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Timer className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Pomodoro (25/5)</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Focus 25 minutes, then 5-minute break. Log what you did each cycle to reinforce intent and track momentum.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <NotebookPen className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">60/45/30 Rhythm</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Long-to-short focus blocks. After each, jot what you worked on for the last 30 minutes, stand up and walk for 1 minute, resume.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Weekly Review</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Use your tracked blocks to spot patterns, rebalance time, and set 3–5 outcomes for next week.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="text-foreground text-3xl font-bold sm:text-4xl">Why it’s intentionally manual</h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
              Planning is a thinking tool. The tiny act of choosing is where clarity and ownership appear.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-3xl gap-4">
            {reasonsManual.map((r, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                <p className="text-foreground text-lg">{r}</p>
              </motion.div>
            ))}
          </div>

          <Separator className="my-10" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Hand className="h-5 w-5" />
                </div>
                <CardTitle>Low-friction by design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fast keyboard flows, clean UI, and focused defaults keep manual steps light but meaningful.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <CardTitle>Signals you can trust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Because you chose what mattered, your analytics reflect intent—so retrospectives lead to better weeks.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="from-primary/10 rounded-3xl border bg-gradient-to-r via-purple-500/10 to-pink-500/10 p-12"
          >
            <h3 className="text-foreground mb-3 text-3xl font-bold">Start planning with intent</h3>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Build a system that compounds. One deliberate day at a time.
            </p>
            <Button size="lg" className="px-8 py-3 text-lg" asChild>
              <a href="/sign-in">Create your plan</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
