#!/usr/bin/env bun

import { $ } from "bun";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

async function pubfork() {
  try {
    // Move to packages/ai directory
    const aiPackagePath = join(process.cwd(), "packages/ai");
    process.chdir(aiPackagePath);
    
    // Build the project first
    console.log("Building ai package...");
    await $`pnpm build`;
    console.log("✅ Build complete");
    
    // Read current package.json from packages/ai
    const aiPackageJsonPath = join(aiPackagePath, "package.json");
    const originalContent = readFileSync(aiPackageJsonPath, "utf-8");
    const pkg = JSON.parse(originalContent);
    
    // Store original name
    const originalName = pkg.name;
    
    // Update name to @xmorse/ai
    pkg.name = "@xmorse/ai";
    
    // Bump patch version
    const [major, minor, patch] = pkg.version.split(".").map(Number);
    pkg.version = `${major}.${minor}.${patch + 1}`;
    
    console.log(`Publishing ${pkg.name}@${pkg.version}...`);
    
    // Write modified package.json
    writeFileSync(aiPackageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
    
    // Publish to npm
    await $`pnpm publish --access public --no-git-checks`;
    
    // Restore original name but keep the bumped version
    pkg.name = originalName;
    writeFileSync(aiPackageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
    
    console.log(`✅ Successfully published! Package name restored to ${originalName}`);
    console.log(`📦 New version: ${pkg.version}`);
    
  } catch (error) {
    console.error("❌ Error during publishing:", error);
    
    // Attempt to restore original package.json on error
    try {
      const aiPackagePath = join(process.cwd(), "packages/ai");
      const aiPackageJsonPath = join(aiPackagePath, "package.json");
      const currentPkg = JSON.parse(readFileSync(aiPackageJsonPath, "utf-8"));
      if (currentPkg.name === "@xmorse/ai") {
        currentPkg.name = "ai";
        writeFileSync(aiPackageJsonPath, JSON.stringify(currentPkg, null, 2) + "\n");
        console.log("Package name restored after error");
      }
    } catch (restoreError) {
      console.error("Failed to restore package.json:", restoreError);
    }
    
    process.exit(1);
  }
}

pubfork();