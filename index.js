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

// request(
//   options("https://api.github.com/rate_limit"),
//   (error, _response, body) => {
//     if (error) return console.log(error);
//     outputs.limits = body;
//   }
// );

request(
  options(`https://api.github.com/users/${GITHUB_USER}/repos`),
  (error, response, body) => {
    response.body = JSON.parse(response.body);
    fs.writeFile(
      "test-output.json",
      JSON.stringify({ error: error, response: response }),
      () => {}
    );
  }
);
