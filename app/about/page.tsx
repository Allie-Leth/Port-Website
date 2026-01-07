import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Alison Alva - Engineer focused on networked embedded systems and DevOps platform tooling. Specializing in RTOS firmware, IoT, and Kubernetes infrastructure.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-6 pt-16 md:pt-32 pb-8 md:pb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center md:text-left">
          About
        </h1>

        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-8 space-y-6">
          <p className="text-gray-100 text-xl leading-relaxed">
            I&apos;m Alison, an engineer focused on networked embedded systems
            and the DevOps/platform tooling that keeps them running in the real
            world.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Most of my work sits at the intersection of hardware and software:
            circuit design, RTOS-based MCU firmware, wireless device networking,
            OTA/update safety, and the CI/CD + backend plumbing that keeps
            fleets maintainable. I&apos;m self-taught in embedded, formally
            trained in computer science, and I learn fastest by shipping things
            that have to run under real-world constraints.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            I&apos;m particularly interested in production IoT: reliable
            devices, predictable power behavior, and update paths you can trust.
            I&apos;m currently pursuing a master&apos;s in cybersecurity and
            tend to focus more on hardening and resilience than offensive work.
            For me, security is a design requirement from day one, not a feature
            that gets added at the end.
          </p>

          {/* New section: What I work on */}
          <h2 className="text-2xl font-semibold text-white pt-4">
            What I work on
          </h2>

          <div className="grid gap-6 md:grid-cols-2 text-gray-300 text-base">
            <div>
              <h3 className="font-semibold mb-2">Embedded &amp; IoT</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>RTOS-based firmware for networked devices</li>
                <li>Board bring-up, peripherals, and low-level debugging</li>
                <li>Wireless networking, OTA/update flows, and fleet safety</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">DevOps &amp; Platform</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  GitLab CI/CD pipelines for firmware and backend services
                </li>
                <li>
                  Self-hosted k3s cluster for build, deploy, and observability
                </li>
                <li>
                  Logging, metrics, and debugging across distributed systems
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white pt-4">How I work</h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            A lot of my platform work started as support for embedded projects.
            I learned GitLab CI/CD to automate firmware builds and tests, which
            grew into running a Kubernetes (k3s) cluster for build, deploy, and
            observability pipelines. I like building the systems that support
            other systems: networks, tooling, and runtime environments that make
            devices easier to ship and operate.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            I work as a systems generalist with a bias toward depth where it
            matters. Understanding how firmware choices affect networking,
            backend behavior, deployment, and observability leads to better
            decisions at every layer. Real devices don&apos;t respect neat
            abstractions, so I pay close attention to the seams: radios and
            peripherals, scheduling and memory pressure, build pipelines,
            rollout strategies, and everything that tends to break at the
            interfaces.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            When something breaks, I&apos;m usually more interested in
            understanding the system than replacing the part. If a car fails, I
            want enough mechanical and electrical context to fix it. If a server
            or deployment pipeline misbehaves, I follow it across networking,
            OS, and application layers until it&apos;s stable. If an embedded
            project needs a better enclosure or RF behavior, I pick up the CAD,
            materials, or radio fundamentals required to ship something robust.
          </p>

          <h2 className="text-2xl font-semibold text-white pt-4">
            Outside of engineering
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            I&apos;m a hands-on maker: CAD, 3D printing, and electronics
            projects that turn ideas into physical objects. If I&apos;m not
            working on infrastructure or firmware, I&apos;m usually building or
            iterating on a device of my own.
          </p>

          {/* Optional: explicit availability line */}
          <p className="text-gray-400 text-sm pt-4">
            I&apos;m open to roles in embedded/IoT engineering and
            platform/DevOps work focused on CI/CD, Kubernetes, and
            observability.
          </p>
        </div>
      </div>
    </div>
  )
}
