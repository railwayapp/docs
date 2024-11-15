import fs from "fs/promises";

const startComment = "{/* codegen:start do not edit this comment */}";
const endComment = "{/* codegen:end do not edit this comment */}";

async function main() {
  const path = "./src/docs/deploy/config-as-code.md";
  let content = await fs.readFile(path, "utf-8");
  const startIndex = content.indexOf(startComment);
  const endIndex = content.indexOf(endComment);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Could not find start or end comment");
  }

  const response = await fetch(
    "https://backboard.railway.com/railway.schema.json",
  );
  if (!response.ok) {
    throw new Error("Could not fetch JSON schema");
  }

  const jsonSchema = await response.json();
  let newContent = "";

  const { build, deploy } = jsonSchema.properties;

  newContent += generateDocsForProperties("build", build.properties);

  newContent += generateDocsForProperties("deploy", deploy.properties);

  content = [
    content.substring(0, startIndex + startComment.length),
    newContent,
    content.substring(endIndex),
  ].join("\n");

  await fs.writeFile(path, content);
}

function generateDocsForProperties(section, properties) {
  let content = "";

  for (const [key, value] of Object.entries(properties)) {
    const { nullable, value: unwrappedValue } = unwrap(value);
    const propertyPath = `${section}.${key}`;
    const title = titelize(key);
    const link = links[propertyPath];
    if (link) {
      content += `### [${title}](${link})\n\n`;
    } else {
      content += `### ${title}\n\n`;
    }

    const description =
      unwrappedValue.description ?? unwrappedValue.items?.description;
    if (description) {
      content += `${description}.\n\n`;
    }

    const example = examples[propertyPath] ?? value.enum?.[0];

    if (example) {
      content += `\`\`\`toml
[${section}]
${key} = ${
        typeof example === "string" ? `"${example}"` : JSON.stringify(example)
      }
\`\`\`

`;
    } else {
      console.warn(`No example for ${propertyPath}`);
    }

    if (unwrappedValue.enum) {
      content += `Possible values are:\n${value.enum
        .filter(v => !ignoredEnumValues.includes(v))
        .map(v => `- \`${v}\``)
        .join("\n")}\n\n`;
    }

    const note = notes[propertyPath];

    if (note) {
      content += `Note: ${note}.\n\n`;
    }

    if (nullable) {
      content += `This field can be set to \`null\`.\n\n`;
    }
  }

  return content;
}

function unwrap(value) {
  let nullable = false;
  if (!value.anyOf) return { value, nullable };
  if (value.anyOf.length === 2) {
    nullable = value.anyOf.find(v => v.type === "null");
    if (nullable) {
      value = value.anyOf.find(v => v.type !== "null");
    }
  }
  if (value.anyOf.length === 2) {
    const not = value.anyOf.find(v => v.not);
    if (not) {
      value = value.anyOf.find(v => !v.not);
    }
  }
  return { value, nullable };
}

function titelize(key) {
  const s = key.replace(/([A-Z])/g, " $1");
  return s.charAt(0).toUpperCase() + s.substring(1);
}

// Although json-schema supports examples, we build the schema from zod and it doesn't support examples.
// So a solution is to have them here.
const examples = {
  "build.watchPatterns": ["src/**"],
  "build.buildCommand": "yarn run build",
  "build.dockerfilePath": "Dockerfile.backend",
  "build.nixpacksConfigPath": "nixpacks.toml",
  "build.nixpacksPlan": "examples/node",
  "build.nixpacksVersion": "1.13.0",
  "deploy.startCommand": "echo starting",
  "deploy.numReplicas": 2,
  "deploy.healthcheckPath": "/health",
  "deploy.healthcheckTimeout": 300,
  "deploy.restartPolicyMaxRetries": 5,
  "deploy.restartPolicyType": "ON_FAILURE",
  "deploy.cronSchedule": "0 0 * * *",
};

const notes = {
  "build.builder":
    "Railway will always build with a Dockerfile if it finds one. To build with nixpacks, you can remove or rename the Dockerfile.",
};

const links = {
  "build.builder": "/deploy/builds",
  "build.buildCommand": "/deploy/builds#build-command",
  "build.watchPatterns": "/deploy/builds#watch-paths",
  "build.dockerfilePath": "/deploy/dockerfiles",
  "deploy.startCommand": "/deploy/deployments#start-command",
  "deploy.numReplicas": "/develop/services#horizontal-scaling-with-replicas",
  "deploy.healthcheckPath": "/deploy/healthchecks",
  "deploy.healthcheckTimeout": "/deploy/healthchecks#timeout",
  "deploy.restartPolicyType": "/deploy/deployments#configurable-restart-policy",
  "deploy.cronSchedule": "/reference/cron-jobs",
};

const ignoredEnumValues = ["HEROKU", "PAKETO"];

main().catch(console.error);
