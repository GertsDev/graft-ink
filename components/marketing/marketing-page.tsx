"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Timer,
  BarChart3,
  Target,
  Zap,
  Users,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react";

export default function MarketingPage() {
  const features = [
    {
      icon: Timer,
      title: "Smart Time Tracking",
      description:
        "Effortless time tracking with intelligent insights and automatic categorization.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "See your productivity patterns with beautiful, actionable analytics.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: Target,
      title: "Goal Achievement",
      description:
        "Set meaningful goals and track your progress with precision.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Zap,
      title: "Distraction-Free",
      description:
        "Minimalist design that keeps you focused on what matters most.",
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share insights and collaborate with your team seamlessly.",
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
    {
      icon: CheckCircle,
      title: "Cross-Platform",
      description: "Sync across all your devices - mobile, desktop, and web.",
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ];

  const testimonials = [
    {
      quote: "Graft transformed how I manage my time. I'm 40% more productive!",
      author: "Sarah Chen",
      role: "Product Designer",
    },
    {
      quote:
        "Finally, a time tracker that doesn't feel like work. Love the simplicity.",
      author: "Marcus Rodriguez",
      role: "Freelance Developer",
    },
    {
      quote:
        "The analytics helped me identify my peak productivity hours. Game changer!",
      author: "Emily Watson",
      role: "Marketing Manager",
    },
  ];

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Hero Section */}
      <section className="relative flex min-h-screen justify-center overflow-hidden px-6 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Main headline with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-[#D97708] via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Graft your way
            </span>
            <br />
            to productivity
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-muted-foreground mx-auto mt-8 max-w-2xl text-xl leading-8"
          >
            Where focus meets flow. Transform scattered hours into structured
            success with distraction-free productivity for the modern
            professional.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="group px-8 py-3 text-lg" asChild>
              <a href="/sign-in">
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Start Tracking Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-muted-foreground mt-16 flex items-center justify-center gap-8 text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Open Source
            </div>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          className="from-primary/20 absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br to-purple-500/20 opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/20 to-orange-500/20 opacity-20 blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to
              <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                {" "}
                succeed
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Professional-grade tools designed for focus, built for results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="hover:border-primary/20 h-full border-2 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div
                      className={`h-12 w-12 rounded-lg ${feature.color} mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="group-hover:text-primary text-xl transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by professionals
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {" "}
                worldwide
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              See what our users are saying about their productivity
              transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <blockquote className="text-foreground mb-4 text-lg font-medium">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center">
                      <div className="from-primary mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br to-purple-500 font-semibold text-white">
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-foreground font-semibold">
                          {testimonial.author}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="from-primary/10 rounded-3xl border bg-gradient-to-r via-purple-500/10 to-pink-500/10 p-12">
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your productivity?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Join thousands of professionals who&apos;ve already discovered the
              Graft Method. Your time is your most valuable asset - invest
              wisely.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="group px-8 py-3 text-lg" asChild>
                <a href="/sign-in">
                  <Timer className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="ghost" size="lg" className="px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              Built for the focused. Designed for the driven. Made for you.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
