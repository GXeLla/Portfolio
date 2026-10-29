const fs = require("fs");
const https = require("https");
const http = require("http");

const owner = "GXeLla";
const apiVersion = "2022-11-28";
const token = process.env.GITHUB_TOKEN || "";
const projectOverridesPath = "script/project-date-overrides.json";

function requestHeaders(url, credential = token) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "Portfolio-GitHub-sync",
    "X-GitHub-Api-Version": apiVersion,
    ...(credential && new URL(url).origin === "https://api.github.com" ? { Authorization: `Bearer ${credential}` } : {}),
  };
}

function request(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const transport = new URL(url).protocol === "http:" ? http : https;
    const call = transport.request(url, { headers: requestHeaders(url), method }, (response) => {
      let body = "";
      response.on("data", chunk => body += chunk);
      response.on("error", reject);
      response.on("end", () => {
        const status = response.statusCode;
        if (new URL(url).origin === "https://api.github.com" && (status === 429 || status >= 500 || (status === 403 && response.headers['x-ratelimit-remaining'] === '0'))) {
          reject(new Error(`GitHub API unavailable or rate limited (HTTP ${status}); existing project data was not replaced.`));return;
        }
        if (status >= 200 && status < 300 && body && method !== "HEAD") {
          try { resolve({ status, body: JSON.parse(body), headers: response.headers }); }
          catch (error) { reject(error); }
        } else resolve({ status, body: null, headers: response.headers });
      });
    });
    call.setTimeout(20000, () => call.destroy(new Error(`Request timed out: ${new URL(url).hostname}`)));
    call.on("error", reject);
    call.end();
  });
}

async function api(path) {
  return request(`https://api.github.com${path}`);
}

function isLiveUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function liveUrlFor(repo, pages) {
  const candidates = [repo.homepage, pages?.html_url];
  if (repo.has_pages) candidates.push(`https://${owner.toLowerCase()}.github.io/${repo.name}/`);

  for (const candidate of candidates) {
    if (!isLiveUrl(candidate)) continue;
    try {
      const response = await request(candidate, "HEAD");
      if (response.status >= 200 && response.status < 400) return candidate;
    } catch {
      // A deployment may be temporarily unavailable. It will be retried on
      // the next scheduled sync instead of adding a broken preview now.
    }
  }
  return "";
}

function titleFromRepository(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function projectOverrides() {
  if (!fs.existsSync(projectOverridesPath)) return {};
  const overrides = JSON.parse(fs.readFileSync(projectOverridesPath, "utf8"));
  return overrides && typeof overrides === "object" ? overrides : {};
}

function projectOverrideFor(repo) {
  const override = projectOverrides()[repo.name];
  // A plain string remains a convenient handwritten date override.
  return typeof override === "string" ? { date: override } : override || {};
}

async function firstCommitDateFor(repo) {
  const firstPage = await api(`/repos/${owner}/${encodeURIComponent(repo.name)}/commits?per_page=100`);
  if (firstPage.status !== 200 || !Array.isArray(firstPage.body) || !firstPage.body.length) return repo.created_at;

  const link = firstPage.headers?.link || "";
  const lastPageLink = link.split(",").find((item) => item.includes('rel="last"'));
  const lastPageUrl = lastPageLink?.match(/<([^>]+)>/)?.[1];
  const lastPage = lastPageUrl ? await request(lastPageUrl) : firstPage;
  const firstCommit = lastPage.body?.at(-1) || firstPage.body.at(-1);
  return firstCommit?.commit?.author?.date || firstCommit?.commit?.committer?.date || repo.created_at;
}

function technologyList(languages, packageJson) {
  const technologies = Object.keys(languages || {});
  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };
  const add = (technology) => {
    if (!technologies.includes(technology)) technologies.unshift(technology);
  };

  if (dependencies["@angular/core"]) add("Angular");
  if (dependencies.react || dependencies["react-dom"]) add("React");
  if (dependencies.tailwindcss) add("Tailwind CSS");
  if (dependencies.three) add("Three.js");

  return technologies.map((technology) => ({
    "SCSS": "Sass",
    "Vue": "Vue.js",
  })[technology] || technology);
}

function groupFor(technologies) {
  if (technologies.includes("Angular")) return "angular";
  if (technologies.includes("React")) return "react";
  if (technologies.some((item) => ["JavaScript", "TypeScript"].includes(item))) return "javascript";
  if (technologies.some((item) => ["HTML", "CSS", "Sass", "Tailwind CSS"].includes(item))) return "html";
  return "github";
}

async function packageJsonFor(repo) {
  const response = await api(`/repos/${owner}/${encodeURIComponent(repo.name)}/contents/package.json`);
  if (response.status !== 200 || !response.body?.content) return null;
  try {
    return JSON.parse(Buffer.from(response.body.content, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

async function buildProject(repo) {
  const [languagesResponse, pagesResponse, packageJson, firstCommitDate] = await Promise.all([
    api(`/repos/${owner}/${encodeURIComponent(repo.name)}/languages`),
    api(`/repos/${owner}/${encodeURIComponent(repo.name)}/pages`),
    packageJsonFor(repo),
    firstCommitDateFor(repo),
  ]);
  if (languagesResponse.status !== 200) throw new Error(`Could not read languages for ${repo.name} (HTTP ${languagesResponse.status}); existing project data was not replaced.`);
  const technologies = technologyList(languagesResponse.body, packageJson);
  const override = projectOverrideFor(repo);
  return {
    id: `github-${repo.id}`,
    group: override.group || groupFor(technologies),
    date: override.date || formatDate(firstCommitDate),
    title: repo.name === repo.name.toLowerCase() ? titleFromRepository(repo.name) : repo.name,
    description: repo.description || "Public GitHub repository.",
    technologies,
    liveUrl: await liveUrlFor(repo, pagesResponse.body),
    repoUrl: repo.html_url,
    favorite: false,
    isGitHubManaged: true,
  };
}

async function listRepositories(fetchPage = api) {
  const repositories = new Map();
  for (let page = 1; ; page++) {
    const response = await fetchPage(`/users/${owner}/repos?type=owner&sort=created&direction=asc&per_page=100&page=${page}`);
    if (response.status !== 200 || !Array.isArray(response.body)) throw new Error(`Could not list repositories (HTTP ${response.status}).`);
    for (const repo of response.body) repositories.set(repo.id, repo);
    if (response.body.length < 100) break;
  }
  return [...repositories.values()].filter(repo => !repo.private && !repo.archived && !repo.fork && repo.name !== "Portfolio");
}

async function main() {
  const repositories = await listRepositories();
  const projects = [];
  for (const repository of repositories) projects.push(await buildProject(repository));

  const output = `/* Generated by script/sync-github-projects.cjs. Do not edit manually. */\nwindow.GITHUB_PROJECTS = ${JSON.stringify(projects, null, 2)};\n`;
  fs.writeFileSync("script/github-projects.js", output);
  console.log(`Synced ${projects.length} public GitHub repositories.`);
}

module.exports = { listRepositories, requestHeaders };

if (require.main === module) main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
