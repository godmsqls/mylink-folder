export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level?: string }[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
  primary?: boolean;
}

export interface LinkItem {
  id: string;
  type: "link" | "highlight" | "header";
  title: string;
  subtitle?: string;
  url?: string;
  iconName?: string;
  badgeText?: string;
  isActive: boolean;
  order: number;
  createdAt?: number;
}

export const PROFILE_DATA = {
  name: "고은빈",
  englishName: "Eunbin Ko",
  role: "Frontend Developer & UI/UX Creator",
  bio: "문제를 코드로 해결하고 직관적인 사용자 경험을 디자인하는 프론트엔드 개발자입니다. 최신 웹 기술과 AI Vibe Coding으로 빠르고 완성도 높은 프로덕트를 만들어갑니다.",
  location: "Seoul, South Korea",
  status: "새로운 기회와 프로젝트 협업에 열려있습니다",
  availability: "Available for Projects",
  email: "godmsqls@gmail.com",
  avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  stats: [
    { label: "프로젝트", value: "12+" },
    { label: "기술 스택", value: "15+" },
    { label: "커밋 수", value: "480+" },
  ],
  links: [
    {
      id: "header-1",
      type: "header",
      title: "📂 소셜 채널",
      isActive: true,
      order: 1,
    } as LinkItem,
    {
      id: "link-1",
      type: "link",
      title: "GitHub",
      subtitle: "@godmsqls",
      url: "https://github.com/godmsqls",
      iconName: "github",
      isActive: true,
      order: 2,
    } as LinkItem,
    {
      id: "link-2",
      type: "link",
      title: "Velog",
      subtitle: "기술 블로그",
      url: "https://velog.io",
      iconName: "book-open",
      isActive: true,
      order: 3,
    } as LinkItem,
    {
      id: "link-3",
      type: "link",
      title: "LinkedIn",
      subtitle: "LinkedIn 프로필",
      url: "https://linkedin.com",
      iconName: "linkedin",
      isActive: true,
      order: 4,
    } as LinkItem,
    {
      id: "header-2",
      type: "header",
      title: "🔥 추천 콘텐츠",
      isActive: true,
      order: 5,
    } as LinkItem,
    {
      id: "link-4",
      type: "highlight",
      title: "최신 블로그 포스트",
      subtitle: "React 19 신기능 정리",
      url: "https://velog.io",
      iconName: "sparkles",
      badgeText: "HOT",
      isActive: true,
      order: 6,
    } as LinkItem,
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/godmsqls",
      icon: "github",
      label: "@godmsqls",
      primary: true,
    },
    {
      name: "Velog",
      url: "https://velog.io",
      icon: "book-open",
      label: "기술 블로그",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "linkedin",
      label: "LinkedIn 프로필",
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: "instagram",
      label: "일상 & 디자인",
    },
  ],
  skills: [
    {
      category: "Frontend Development",
      skills: [
        { name: "React 19" },
        { name: "Next.js 16" },
        { name: "TypeScript" },
        { name: "JavaScript (ES6+)" },
        { name: "HTML5 / CSS3" },
      ],
    },
    {
      category: "Styling & UI Design",
      skills: [
        { name: "Tailwind CSS v4" },
        { name: "Glassmorphism UI" },
        { name: "Responsive Design" },
        { name: "Figma" },
      ],
    },
    {
      category: "Tools & Workflow",
      skills: [
        { name: "Git / GitHub" },
        { name: "Vibe Coding (AI-Assisted)" },
        { name: "Vercel" },
        { name: "VS Code" },
      ],
    },
  ],
  projects: [
    {
      id: "mylink",
      title: "MyLink - Personal Bio & Showcase",
      description:
        "Next.js 16과 Tailwind CSS v4로 구현한 현대적인 반응형 개인 프로필 및 링크 트리 플랫폼입니다.",
      tags: ["Next.js", "React 19", "Tailwind CSS v4", "TypeScript"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://my-link.vercel.app",
      githubUrl: "https://github.com/godmsqls/my-link",
      featured: true,
    },
    {
      id: "vibe-canvas",
      title: "Vibe Canvas - AI Creative Board",
      description:
        "인터랙티브 캔버스와 AI 비주얼 생성 모델을 결합한 실시간 크리에이티브 무드보드 및 아이디어 스케치 툴입니다.",
      tags: ["React", "HTML5 Canvas", "AI APIs", "Tailwind"],
      image:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://vibe-canvas.example.com",
      githubUrl: "https://github.com/godmsqls",
      featured: true,
    },
    {
      id: "dev-insights",
      title: "Dev Insights - Tech Knowledge Archive",
      description:
        "프론트엔드 개발 팁과 아키텍처 고민을 기록하는 모던 MDX 기반의 클린 테크 블로그입니다.",
      tags: ["Next.js", "MDX", "SEO 최적화", "Vercel"],
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://dev-insights.example.com",
      githubUrl: "https://github.com/godmsqls",
      featured: false,
    },
    {
      id: "focus-pulse",
      title: "Focus Pulse - Minimal Productivity",
      description:
        "집중도 높은 업무 리듬과 루틴 형성을 돕는 감각적인 인터페이스의 웹 타이머 및 생산성 앱입니다.",
      tags: ["TypeScript", "Web Audio API", "PWA"],
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://focus-pulse.example.com",
      githubUrl: "https://github.com/godmsqls",
      featured: false,
    },
  ],
};
