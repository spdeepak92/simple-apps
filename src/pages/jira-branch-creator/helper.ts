import { z } from "zod";

export const prefixOptions = [
  { value: "feature/", Label: "feature" },
  { value: "bugfix/", Label: "bugfix" },
  { value: "docs/", Label: "docs" },
  { value: "style/", Label: "style" },
  { value: "refactor/", Label: "refactor" },
  { value: "test/", Label: "test" },
  { value: "chore/", Label: "chore" },
];

export const FormSchema = z.object({
  inputString: z.string().min(5, {
    message: "Entered string must be at least 5 characters.",
  }),
  removeString: z.string(),
  skipLowercase: z.string(),
  addPrefix: z.string(),
});

export const getPrefixDesc = (addPrefix: string) => {
  let prefixHelp = "";

  switch (addPrefix) {
    case "feature/":
      prefixHelp = "A new feature.";
      break;
    case "bugfix/":
      prefixHelp = "A bug fix.";
      break;
    case "docs/":
      prefixHelp = "Documentation only changes.";
      break;
    case "style/":
      prefixHelp =
        "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).";
      break;
    case "refactor/":
      prefixHelp = "A code change that neither fixes a bug nor adds a feature.";
      break;
    case "test/":
      prefixHelp = "Adding missing or correcting existing tests.";
      break;
    case "chore/":
      prefixHelp =
        "Changes to the build process or auxiliary tools and libraries such as documentation generation.";
      break;
    default:
      prefixHelp = "";
      break;
  }

  return prefixHelp;
};

export const generateBranchName = (data: z.infer<typeof FormSchema>) => {
  // Split the input of substrings to remove by comma and trim each entry
  const substringsToRemove = data.removeString
    .split(",")
    .map((substring) => substring.trim());

  let stringWithoutSubstrings = data.inputString.replace(/[^a-zA-Z0-9]/g, " ");

  // Remove all substrings from the input string
  substringsToRemove.forEach((substring) => {
    stringWithoutSubstrings = stringWithoutSubstrings.replace(
      new RegExp(`\\b${substring}\\b`, "gi"),
      ""
    );
  });

  const words = stringWithoutSubstrings.split(" ");

  const urlString = words
    .map((word) => {
      if (word.trim() === "") return; // Skip empty strings

      if (word.toLowerCase() === data.skipLowercase.toLowerCase()) {
        return word;
      } else {
        return word.toLowerCase().replace(/[^\w\s]/gi, "");
      }
    })
    .filter(Boolean) // Filter out undefined, null, and empty strings
    .join("-")
    .trim();

  const resultString = `${data.addPrefix}${urlString.replace(/^-+|-+$/g, "")}`;

  return resultString;
};

export const copyToClipboard = async function (
  resultString: string,
  setBtnValue: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    await navigator.clipboard.writeText(resultString);
    setBtnValue("Copied...");
  } catch (err) {
    console.log(`Failed to copy: ${err}`);
    setBtnValue("Failed...");
  } finally {
    setTimeout(() => {
      setBtnValue("Copy");
    }, 1200);
  }
};
