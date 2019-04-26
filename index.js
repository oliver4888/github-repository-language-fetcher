const request = require("request");
const fs = require("fs");

const PRIVATE_REPOS = "_private-repos";
const GITHUB_USER = "oliver4888";

const output = {
  limits: null,
  repos: [
    {
      name: PRIVATE_REPOS
    }
  ]
};

const options = url => {
  return {
    url: url,
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Oliver4888"
    }
  };
};

console.log(`Fetching repositories for ${GITHUB_USER}`);

request(
  options(`https://api.github.com/users/${GITHUB_USER}/repos`),
  (_error, _response, body) => {
    let repos = JSON.parse(body);
    console.log(`Found ${repos.length} repositories.\n`);
    fetchLanguages(JSON.parse(body));
  }
);

function fetchLanguages(repos) {
  console.log("Fetching languages for:");
  fetchLanguage(repos, 0);
}

function fetchLanguage(repos, idx) {
  console.log(`${idx + 1}: ${repos[idx].name} ${repos[idx].private ? " (private)" : ""}`);
  request(options(repos[idx].languages_url), (_error, _response, body) => {
    console.log(`  ${body}`);
    if (repos[idx].private) {
      // add up languages
    } else {
      output.repos.push({
        name: repos[idx].name,
        languages: (body = JSON.parse(body))
      });
    }

    if (idx === repos.length - 1) {
      fetchLimits();
    } else {
      fetchLanguage(repos, ++idx);
    }
  });
}

function fetchLimits() {
  request(
    options("https://api.github.com/rate_limit"),
    (_error, _response, body) => {
      output.limits = JSON.parse(body);
      outputToJson();
    }
  );
}

function outputToJson() {
  fs.writeFile("output.json", JSON.stringify(output), () => {});
}
