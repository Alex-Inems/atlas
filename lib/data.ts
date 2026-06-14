/* Verified industry & project data — sources cited in UI */

import type {
    IndustryStat,
    SafetyStat,
    LandmarkProject,
    ServiceOffering,
    ProcessStep,
    BlogPost,
    CompanyInfo,
    Leader,
    Testimonial,
} from "@/lib/types/content";

export const industryStats = [
    { value: "8.3M", label: "US construction workers", source: "BLS, Oct 2024" },
    { value: "$11.2T", label: "Global market size", source: "MRFR, 2024" },
    { value: "281M", label: "Workers worldwide", source: "WiFi Talents, 2023" },
    { value: "74%", label: "US architects using BIM", source: "NIBS / PlanRadar" },
] as const satisfies readonly IndustryStat[];

export const safetyStats = [
    { value: "15", unit: "/day", label: "US worker deaths (2023 avg)", note: "Down from 38/day in 1970 — OSHA" },
    { value: "39.2%", label: "Construction deaths from falls", note: "BLS Census of Fatal Injuries, 2023" },
    { value: "12.9", unit: "per 100K", label: "Fatal injury rate", note: "Construction & extraction occupations, BLS 2023" },
    { value: "70%", label: "Architects using BIM by 2025", note: "USP Architectural Barometer forecast" },
] satisfies readonly SafetyStat[];

export const landmarkProjects = [
    {
        id: "spiral",
        title: "The Spiral",
        location: "New York City, USA",
        year: "2023",
        category: "commercial",
        architect: "Bjarke Ingels Group",
        builder: "Turner Construction",
        developer: "Tishman Speyer",
        height: "314 m (1,031 ft)",
        floors: "66 storeys",
        area: "2.8 million sq ft",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        description: "BIG's first supertall — a stepped terrace tower along the High Line with 2.8M sq ft of Class-A office space.",
    },
    {
        id: "mori-jp",
        title: "Mori JP Tower",
        location: "Tokyo, Japan",
        year: "2024",
        category: "commercial",
        architect: "Pelli Clarke & Partners",
        builder: "Mori Building",
        developer: "Azabudai Hills",
        height: "330 m",
        floors: "64 storeys",
        area: "Japan's tallest building",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
        description: "Tokyo's first supertall skyscraper and tallest building in Japan, anchoring the Azabudai Hills mixed-use district.",
    },
    {
        id: "hangzhou",
        title: "Greenland Hangzhou Century Center",
        location: "Hangzhou, China",
        year: "2023",
        category: "commercial",
        architect: "Skidmore, Owings & Merrill",
        builder: "Greenland Group",
        developer: "Qianjiang Century City",
        height: "310 m",
        floors: "64 storeys",
        area: "344,907 sq m",
        image: "https://images.unsplash.com/photo-1477959854877-67bf27b1731f?auto=format&fit=crop&w=1200&q=80",
        description: "Twin towers connected by a skybridge — gateway landmark built for the 2023 Asian Games.",
    },
    {
        id: "one-city",
        title: "One City Centre",
        location: "Bangkok, Thailand",
        year: "2023",
        category: "commercial",
        architect: "Skidmore, Owings & Merrill",
        builder: "Bouygues-Thai",
        developer: "Mitsubishi Estate × Raimon Land",
        height: "276 m",
        floors: "61 storeys",
        area: "61,000 sq m leasable",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        description: "Thailand's tallest Grade A+ office tower — Mitsubishi Estate Group's first office development in Thailand.",
    },
    {
        id: "manhattan-west",
        title: "Two Manhattan West",
        location: "New York City, USA",
        year: "2024",
        category: "commercial",
        architect: "Skidmore, Owings & Merrill",
        builder: "Brookfield Properties",
        developer: "Manhattan West",
        height: "2M sq ft office",
        floors: "LEED Gold target",
        area: "7M sq ft district",
        image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
        description: "Final tower completing the 7M sq ft Manhattan West neighbourhood built above active Penn Station rail tracks.",
    },
    {
        id: "one-vanderbilt",
        title: "One Vanderbilt",
        location: "New York City, USA",
        year: "2020",
        category: "commercial",
        architect: "Kohn Pedersen Fox",
        builder: "Tishman Construction",
        developer: "SL Green Realty",
        height: "427 m (1,401 ft)",
        floors: "58 storeys",
        area: "1.75 million sq ft",
        image: "https://images.unsplash.com/photo-1574362845609-0c4e72d0d740?auto=format&fit=crop&w=1200&q=80",
        description: "LEED Platinum office tower adjacent to Grand Central — among NYC's tallest and most sustainable skyscrapers.",
    },
] as const satisfies readonly LandmarkProject[];

export const services = [
    {
        num: "01",
        title: "General Contracting",
        description: "Pre-construction planning, site management, subcontractor coordination, and turnkey delivery — the full GC scope per AIA standard practices.",
        capabilities: ["Pre-construction & estimating", "Site logistics", "Subcontractor management", "Quality assurance"],
    },
    {
        num: "02",
        title: "Design-Build",
        description: "Single-source accountability from concept through certificate of occupancy. Reduces change orders and compresses schedules by 15–30% per DBIA research.",
        capabilities: ["Integrated design teams", "Value engineering", "Accelerated permitting", "Single contract delivery"],
    },
    {
        num: "03",
        title: "Structural & Civil",
        description: "Foundations, steel erection, concrete superstructures, and site civil works — executed to IBC and local jurisdiction codes.",
        capabilities: ["Deep foundations", "Steel & concrete cores", "Post-tension slabs", "Earthworks"],
    },
    {
        num: "04",
        title: "MEP & Building Systems",
        description: "Mechanical, electrical, plumbing, and fire protection coordination using BIM clash detection — 74% of US contractors now use BIM on billable work.",
        capabilities: ["HVAC & plumbing", "Electrical distribution", "Fire protection", "BIM coordination"],
    },
    {
        num: "05",
        title: "Façade & Envelope",
        description: "Curtain wall, waterproofing, and building envelope systems that meet IECC energy code and LEED certification targets.",
        capabilities: ["Curtain wall install", "Waterproofing", "Insulation systems", "Commissioning support"],
    },
    {
        num: "06",
        title: "Pre-Construction",
        description: "Feasibility, constructability review, and detailed scheduling before groundbreak — where 70% of project cost is determined.",
        capabilities: ["Cost modeling", "Schedule optimization", "Risk registers", "Permit strategy"],
    },
] as const satisfies readonly ServiceOffering[];

export const processSteps = [
    { num: "01", title: "Discovery", description: "Site analysis, geotechnical review, budget validation, and stakeholder alignment.", deliverables: ["Feasibility report", "Budget range", "Risk assessment", "Project charter"] },
    { num: "02", title: "Design Development", description: "Architectural and engineering coordination with BIM LOD 300+ models for clash-free documentation.", deliverables: ["BIM model", "Structural calcs", "MEP coordination", "Permit drawings"] },
    { num: "03", title: "Pre-Construction", description: "GMP development, subcontractor buyout, and CPM scheduling with critical path identification.", deliverables: ["GMP contract", "Master schedule", "Safety plan", "Logistics plan"] },
    { num: "04", title: "Construction", description: "Field execution with daily safety stand-downs, QA/QC inspections, and owner progress reporting.", deliverables: ["Weekly reports", "RFI management", "Inspection logs", "Change orders"] },
    { num: "05", title: "Closeout", description: "Systems commissioning, punch list resolution, O&M manual delivery, and warranty activation.", deliverables: ["Commissioning", "As-builts", "O&M manuals", "Final payment"] },
] as const satisfies readonly ProcessStep[];

export const blogPosts = [
    {
        category: "Safety",
        title: "Construction accounted for 1 in 5 US workplace deaths in 2023",
        excerpt: "BLS data shows 1,075 construction fatalities — 39.2% from falls. The National Safety Stand-Down runs May 5–9 annually to address this.",
        date: "May 2025",
        readTime: "4 min",
        source: "Bureau of Labor Statistics",
    },
    {
        category: "Technology",
        title: "US BIM market projected to reach $7.69 billion by 2034",
        excerpt: "At 11.46% CAGR from a $2.33B base in 2023. 74% of US architecture firms and 70% of contractors now use BIM on projects.",
        date: "Mar 2025",
        readTime: "6 min",
        source: "Precedence Research / NIBS",
    },
    {
        category: "Market",
        title: "Global construction market hit $11.2 trillion in 2024",
        excerpt: "Projected to reach $18.6 trillion by 2035 at 4.7% CAGR, driven by infrastructure investment and urbanization in APAC.",
        date: "Jan 2025",
        readTime: "5 min",
        source: "Market Research Future",
    },
    {
        category: "Projects",
        title: "Mori JP Tower opens as Japan's tallest building at 330 metres",
        excerpt: "Pelli Clarke & Partners' supertall anchors Tokyo's Azabudai Hills — 64 floors of offices, residences, and retail.",
        date: "Mar 2024",
        readTime: "3 min",
        source: "Dezeen",
    },
    {
        category: "Sustainability",
        title: "Green buildings now represent 40% of new construction globally",
        excerpt: "Net-zero projects forecast to reach 25% market share by 2030 as IECC and LEED standards tighten worldwide.",
        date: "Feb 2025",
        readTime: "5 min",
        source: "WiFi Talents Industry Report",
    },
] as const satisfies readonly BlogPost[];

export const companyInfo = {
    name: "Inema",
    legalName: "PT Inema Konstruksi",
    founded: "2020",
    headquarters: "Jl. Dr. Makaliwe Raya No. 28, West Jakarta, Indonesia",
    phone: "+62 812-9111-1887",
    email: "inema9886@gmail.com",
    website: "inema.build",
    employees: "18+",
    description: "Full-service general contractor and design-build firm delivering civil, structural, architectural, and MEP works across residential and commercial sectors.",
} as const satisfies CompanyInfo;

export const leadership = [
    { name: "Yandhika Wijaya", role: "Deputy Head of Operations", note: "Inema Construction, Jakarta" },
    { name: "Operations Team", role: "Project Management", note: "Multi-sector construction since 1940s industry heritage" },
    { name: "Design Studio", role: "Architectural & MEP Consultancy", note: "Structural, interior, and furniture design" },
    { name: "Field Division", role: "Site Execution", note: "Civil, façade, and specialist applicator teams" },
] as const satisfies readonly Leader[];

export const testimonial = {
    quote: "Inema delivered beyond expectations. The professionalism, precision, and execution were world class.",
    author: "Jonathan Reed",
    role: "CEO, Prime Developments",
} as const satisfies Testimonial;
