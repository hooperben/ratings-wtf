import fs from "fs";

export const writeToPublic = (fullPath: string, contentToAdd: string) => {
  if (fs.existsSync(fullPath)) {
    fs.appendFileSync(fullPath, contentToAdd);
  } else {
    fs.writeFileSync(fullPath, `${contentToAdd}`);
  }
};
