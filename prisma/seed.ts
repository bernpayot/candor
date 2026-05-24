import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const junior = await prisma.interviewLevel.create({
    data: {
      levelName: "Junior",
      description:
        "Designed for entry-level developers who are building foundational skills and preparing for beginner-friendly technical interviews.",
    },
  });

  const senior = await prisma.interviewLevel.create({
    data: {
      levelName: "Senior",
      description:
        "Designed for experienced developers who are preparing for advanced interviews involving architecture, problem-solving, leadership, and deeper technical decision-making.",
    },
  });

  const react = await prisma.interviewSpecialty.create({
    data: {
      specialtyName: "React",
      description:
        "Focuses on React concepts such as components, state management, hooks, rendering behavior, performance, and common frontend patterns.",
    },
  });

  const frontend = await prisma.interviewSpecialty.create({
    data: {
      specialtyName: "Frontend",
      description:
        "Focuses on core frontend development skills including HTML, CSS, JavaScript, accessibility, responsive design, browser behavior, and UI implementation.",
    },
  });

  const backend = await prisma.interviewSpecialty.create({
    data: {
      specialtyName: "Backend",
      description:
        "Focuses on backend development concepts such as APIs, databases, authentication, server-side architecture, validation, and error handling.",
    },
  });

  const dsa = await prisma.interviewSpecialty.create({
    data: {
      specialtyName: "Data Structures and Algorithms",
      description:
        "Focuses on problem-solving skills using common data structures, algorithms, complexity analysis, and coding interview patterns.",
    },
  });

  const javascript = await prisma.interviewSpecialty.create({
    data: {
      specialtyName: "Javascript",
      description:
        "Focuses on JavaScript fundamentals including scope, closures, asynchronous programming, promises, event loop behavior, objects, and modern language features.",
    },
  });

  const systemDesign = await prisma.interviewSpecialty.create({
    data: {
      specialtyName: "System Design",
      description:
        "Focuses on designing scalable systems, discussing architecture trade-offs, databases, caching, queues, APIs, reliability, and performance considerations.",
    },
  });

  await prisma.interviewPrompt.create({
    data: {
      levelId: junior.id,
      specialtyId: frontend.id,
      topics: [
        "Semantic HTML structure",
        "CSS box model and layout",
        "Responsive design fundamentals",
        "Basic JavaScript DOM manipulation",
        "Accessibility basics",
        "HTML forms and input types",
        "CSS flexbox and grid basics",
        "Media queries",
        "Browser developer tools",
        "Basic client-side validation",
        "Event handling",
        "Fetch API fundamentals",
        "Page load and asset basics",
      ],
      avoidTopics: [
        "Advanced frontend architecture",
        "Complex state management libraries",
        "Server-side rendering internals",
        "Micro-frontend architecture",
        "Advanced performance profiling",
        "Custom build tool configuration",
        "Browser rendering engine internals",
        "Large-scale design system governance",
        "Advanced animation pipelines",
        "WebAssembly",
      ],
    },
  });
  await prisma.interviewPrompt.create({
    data: {
      levelId: junior.id,
      specialtyId: backend.id,
      topics: [
        "REST API fundamentals",
        "Request validation",
        "Database queries and relationships",
        "Authentication basics",
        "Error handling and status codes",
        "HTTP methods and headers",
        "Route handlers and controllers",
        "Basic SQL concepts",
        "Environment variables",
        "Password hashing basics",
        "Pagination and filtering",
        "Logging basics",
        "Simple API testing",
      ],
      avoidTopics: [
        "Distributed systems architecture",
        "Advanced database optimization",
        "Message queue internals",
        "Large-scale infrastructure design",
        "Event-driven architecture",
        "Container orchestration",
        "Sharding and replication strategies",
        "Advanced caching strategies",
        "Service mesh concepts",
        "Multi-region deployment planning",
      ],
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
