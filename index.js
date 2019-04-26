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

request(
  options(`https://api.github.com/users/${GITHUB_USER}/repos`),
  (_error, _response, body) => {
    fetchLanguages(JSON.parse(body), 0);
  }
);

function fetchLanguages(repos, idx) {
  console.log(`Fetching languages for${repos[idx].private ? " private" : ""} repository: ${repos[idx].name}`);
  request(options(repos[idx].languages_url), (_error, _response, body) => {
    if (repos[idx].private) {
      // add up languages
    } else {
      output.repos.push({
        name: repos[idx].name,
        languages: JSON.parse(body)
      });
    }

    if (idx === repos.length - 1) {
      fetchLimits();
    } else {
      fetchLanguages(repos, idx + 1);
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
