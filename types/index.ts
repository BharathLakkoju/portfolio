export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    emoji: string;
    gradient: string;
    read_time: number;
    published: boolean;
    published_at: string;
    created_at?: string;
    updated_at?: string;
}

export interface WorkExperience {
    id: number;
    role: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
    display_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface Project {
    id: number;
    icon: string;
    image_path?: string;
    active: boolean;
    status_label: string;
    title: string;
    description: string;
    tags: string[];
    display_order: number;
    created_at?: string;
    updated_at?: string;
}

