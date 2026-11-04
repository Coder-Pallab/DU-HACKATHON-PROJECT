const OFFICIAL_LEARNING_RESOURCES = {
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  typescript: "https://www.typescriptlang.org/docs/",
  react: "https://react.dev/learn",
  "react.js": "https://react.dev/learn",
  "node.js": "https://nodejs.org/en/learn",
  node: "https://nodejs.org/en/learn",
  python: "https://docs.python.org/3/tutorial/",
  java: "https://dev.java/learn/",
  html: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
  css: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
  sql: "https://www.postgresql.org/docs/current/tutorial.html",
  postgresql: "https://www.postgresql.org/docs/current/",
  mongodb: "https://www.mongodb.com/docs/",
  git: "https://git-scm.com/doc",
  docker: "https://docs.docker.com/get-started/",
  aws: "https://docs.aws.amazon.com/",
  "c++": "https://isocpp.org/get-started",
  "c#": "https://learn.microsoft.com/en-us/dotnet/csharp/",
  go: "https://go.dev/learn/",
  golang: "https://go.dev/learn/",
  rust: "https://www.rust-lang.org/learn",
  ruby: "https://www.ruby-lang.org/en/documentation/",
  php: "https://www.php.net/manual/en/getting-started.php",
  angular: "https://angular.dev/tutorials",
  vue: "https://vuejs.org/guide/",
  "next.js": "https://nextjs.org/learn",
  django: "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
  flask: "https://flask.palletsprojects.com/en/stable/tutorial/",
  express: "https://expressjs.com/en/starter/installing.html",
};

export function getLearningResource(skill) {
  const normalizedSkill = typeof skill === "string" ? skill.trim() : "";
  if (!normalizedSkill) return null;

  const directUrl = OFFICIAL_LEARNING_RESOURCES[normalizedSkill.toLowerCase()];
  if (directUrl) {
    return { url: directUrl, isSearch: false };
  }

  const query = encodeURIComponent(`${normalizedSkill} official documentation learning`);
  return {
    url: `https://www.google.com/search?q=${query}`,
    isSearch: true,
  };
}
