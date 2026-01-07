import type { StackData, ProjectData, LayerData } from './types'

/**
 * Fetches stack diagram data.
 * Currently returns static data, but structured for future API/CMS integration.
 */
export async function getStackData(): Promise<StackData> {
  const projects: ProjectData[] = [
    {
      id: 'portfolio',
      label: 'Portfolio Site',
      tagline: 'This website',
      tags: ['Full-Stack', 'Next.js', 'TypeScript', 'Kubernetes'],
      details: [
        'Next.js 14 with App Router',
        'MDX blog with typed frontmatter',
        'Static generation at build time',
        'Zero-downtime k8s deployments',
      ],
      highlights: [
        'nextjs',
        'react',
        'gitlab-ci',
        'docker',
        'flux',
        'kubernetes',
        'ingress',
        'cloudflare',
        'linux',
        'typescript',
        'bash',
        'bare-metal',
      ],
      url: '/blog/building-my-portfolio',
    },
    {
      id: 'infrastructure',
      label: 'Home Infrastructure',
      tagline: 'k8s, GitOps & networking',
      tags: ['DevOps', 'Kubernetes', 'GitOps', 'Infrastructure'],
      details: [
        'Multi-node k8s cluster',
        'Flux GitOps with Kustomize',
        "cert-manager + Let's Encrypt",
        'Cloudflare Tunnel ingress',
      ],
      highlights: [
        'gitlab-ci',
        'docker',
        'flux',
        'kubernetes',
        'ingress',
        'cloudflare',
        'linux',
        'bash',
        'bare-metal',
      ],
      url: '/blog/automated-tls-certificates-kubernetes',
    },
    {
      id: 'monitoring',
      label: 'Monitoring Stack',
      tagline: 'Metrics, dashboards & alerting',
      tags: ['DevOps', 'Monitoring', 'Grafana', 'Prometheus'],
      details: [
        'Prometheus + kube-prometheus-stack',
        'Custom Grafana dashboards',
        'Alertmanager pipelines',
        'Long-term metrics retention',
      ],
      highlights: [
        'grafana',
        'prometheus',
        'gitlab-ci',
        'docker',
        'flux',
        'kubernetes',
        'linux',
        'bash',
        'bare-metal',
      ],
    },
    {
      id: 'gitlab-ce',
      label: 'GitLab CE',
      tagline: 'Self-hosted DevOps platform',
      tags: ['DevOps', 'Docker', 'CI/CD', 'GitLab'],
      details: [
        'GitLab Omnibus on Kubernetes',
        'Container registry with Cloudflare',
        'CI/CD runners at scale',
        'Integrated security scanning',
      ],
      highlights: [
        'gitlab-ci',
        'docker',
        'flux',
        'kubernetes',
        'ingress',
        'cloudflare',
        'linux',
        'bash',
        'sql',
        'bare-metal',
      ],
    },
    {
      id: 'antstack',
      label: 'AntStack',
      tagline: 'ESP32 firmware & OTA',
      tags: ['Firmware', 'Embedded Systems', 'IoT', 'C++'],
      details: [
        'ESP32 with FreeRTOS',
        'OTA update system',
        'ESP-NOW mesh networking',
        'Custom PCB design',
      ],
      highlights: [
        'freertos',
        'esp-idf',
        'platformio',
        'gitlab-ci',
        'docker',
        'ota',
        'linux',
        'python',
        'cpp',
        'bash',
        'mcus',
        'pcbs',
      ],
    },
  ]

  const layers: LayerData[] = [
    {
      id: 'frameworks',
      label: 'Frameworks & Tools',
      boxes: [
        { id: 'nextjs', label: 'Next.js', popup: ['App Router', 'SSR', 'ISR'] },
        {
          id: 'react',
          label: 'React',
          popup: ['Hooks', 'Context', 'Components'],
        },
        {
          id: 'flask',
          label: 'Flask',
          popup: ['REST APIs', 'Auth', 'Middleware'],
        },
        {
          id: 'grafana',
          label: 'Grafana',
          popup: ['Dashboards', 'Alerting', 'Panels'],
        },
        {
          id: 'prometheus',
          label: 'Prometheus',
          popup: ['Exporters', 'PromQL', 'Alert Rules'],
        },
        {
          id: 'freertos',
          label: 'FreeRTOS',
          popup: ['Tasks', 'Queues', 'Semaphores'],
          tags: ['Firmware', 'Embedded Systems'],
        },
        {
          id: 'esp-idf',
          label: 'ESP-IDF',
          popup: ['WiFi', 'BLE', 'NVS', 'OTA'],
          tags: ['Firmware', 'Embedded Systems', 'IoT'],
        },
        {
          id: 'platformio',
          label: 'PlatformIO',
          popup: ['Multi-platform', 'Libraries', 'Debugging'],
          tags: ['Firmware', 'Embedded Systems'],
        },
      ],
    },
    {
      id: 'cicd',
      label: 'CI/CD & Delivery',
      boxes: [
        {
          id: 'gitlab-ci',
          label: 'GitLab CI/CD',
          popup: ['Trivy', 'SAST', 'Caching', 'Multi-stage'],
        },
        {
          id: 'docker',
          label: 'Docker',
          popup: ['Multi-stage', 'Minimal Images', 'Layer Caching'],
          tags: ['Docker', 'DevOps'],
        },
        {
          id: 'flux',
          label: 'Flux',
          popup: ['GitOps', 'HelmRelease', 'Kustomize'],
        },
        {
          id: 'ota',
          label: 'OTA',
          popup: ['ESP32 OTA', 'Versioning', 'Staged Rollouts'],
        },
      ],
    },
    {
      id: 'runtime',
      label: 'Runtime Platforms',
      boxes: [
        {
          id: 'kubernetes',
          label: 'Kubernetes',
          popup: ['cert-manager', 'Longhorn', 'Sealed Secrets', 'MetalLB'],
        },
        {
          id: 'ingress',
          label: 'Ingress',
          popup: ['TLS', 'Routing', 'Rate Limiting'],
        },
        {
          id: 'cloudflare',
          label: 'Cloudflare',
          popup: ['Tunnels', 'DNS', 'WAF', 'Zero Trust'],
          tags: ['CloudFlare', 'Infrastructure'],
        },
        {
          id: 'linux',
          label: 'Linux Services',
          popup: ['systemd', 'Background Workers'],
        },
      ],
    },
    {
      id: 'languages',
      label: 'Languages',
      boxes: [
        {
          id: 'typescript',
          label: 'TypeScript',
          popup: ['React', 'Node', 'Type Safety'],
        },
        {
          id: 'python',
          label: 'Python',
          popup: ['Flask', 'Scripting', 'Automation'],
        },
        {
          id: 'cpp',
          label: 'C/C++',
          popup: ['Embedded', 'Firmware', 'Low-level'],
          tags: ['C++', 'Embedded Systems'],
        },
        { id: 'bash', label: 'Bash', popup: ['Scripting', 'Automation', 'CI'] },
        { id: 'sql', label: 'SQL', popup: ['Postgres', 'Queries', 'Data'] },
      ],
    },
    {
      id: 'infrastructure',
      label: 'Infra & Hardware',
      boxes: [
        {
          id: 'bare-metal',
          label: 'Bare Metal',
          popup: ['K3s Cluster', 'GitLab', 'Distributed'],
        },
        {
          id: 'mcus',
          label: 'MCUs',
          popup: ['ESP32', 'ESP32-S3', 'ESP-NOW', 'BLE'],
        },
        {
          id: 'pcbs',
          label: 'Custom PCBs',
          popup: ['KiCad', 'LED Boards', 'Power Regulation'],
        },
      ],
    },
  ]

  return { projects, layers }
}

/**
 * Get the box IDs that should be highlighted for a given project.
 */
export async function getHighlightedBoxes(
  projectId: string
): Promise<string[]> {
  const data = await getStackData()
  const project = data.projects.find((p) => p.id === projectId)
  return project?.highlights ?? []
}
