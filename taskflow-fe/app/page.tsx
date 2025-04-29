import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg" alt="TaskFlow Logo" width={32} height={32} className="h-8 w-8" />
            <span className="font-bold text-xl">TaskFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-[#00B8D4] transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-[#00B8D4] transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-[#00B8D4] transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-[#00B8D4] transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#00B8D4] hover:bg-[#00A0B8] text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Streamline your workflow with <span className="text-[#00B8D4]">TaskFlow</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl">
            The all-in-one project management platform that helps teams collaborate, track progress, and deliver results
            faster.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-[#00B8D4] hover:bg-[#00A0B8] text-white">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
          <div className="mt-16 relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00B8D4] to-[#0052D4] opacity-30 blur"></div>
            <div className="relative rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt="TaskFlow Dashboard"
                width={1200}
                height={600}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Powerful Features for Modern Teams</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage projects, collaborate with your team, and deliver results on time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Task Management",
                description:
                  "Create, assign, and track tasks with ease. Set priorities, deadlines, and dependencies to keep your projects on track.",
                icon: "📋",
              },
              {
                title: "Team Collaboration",
                description:
                  "Work together seamlessly with real-time updates, comments, and file sharing. Keep everyone aligned and informed.",
                icon: "👥",
              },
              {
                title: "Progress Tracking",
                description:
                  "Visualize project progress with interactive charts and reports. Identify bottlenecks and optimize your workflow.",
                icon: "📊",
              },
              {
                title: "Time Management",
                description:
                  "Track time spent on tasks and projects. Analyze productivity patterns and improve resource allocation.",
                icon: "⏱️",
              },
              {
                title: "Customizable Workflows",
                description:
                  "Adapt TaskFlow to your team's unique processes. Create custom fields, statuses, and automation rules.",
                icon: "🔄",
              },
              {
                title: "Integrations",
                description:
                  "Connect with your favorite tools like Slack, Google Drive, and GitHub. Centralize your work in one place.",
                icon: "🔌",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#00B8D4]">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white">Ready to transform how your team works?</h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of teams already using TaskFlow to streamline their workflows and boost productivity.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#00B8D4] hover:bg-gray-100">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/placeholder.svg" alt="TaskFlow Logo" width={24} height={24} className="h-6 w-6" />
              <span className="font-bold text-white">TaskFlow</span>
            </div>
            <p className="text-sm text-gray-500">© 2023 TaskFlow, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
