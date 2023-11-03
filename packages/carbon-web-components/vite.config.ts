/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/


// Defines an array of entry points to be used to search for files.
const entryPoints = [
  'src/components/**/*.ts',
  '!src/components/**/*-story.ts',
  '!src/components/**/stories',
];


// Searches for files that match the patterns defined in the array of input points.
// Returns an array of relative file paths.
const files = fg.sync(entryPoints);

// Maps the file paths in the "files" array to an array of key-value pair.
const entities = files.map((file) => {
  // Extract the part of the file path after the "src" folder and before the file extension.
  const [key] = file.match(/(?<=src\/).*$/) || [];

  // Remove the file extension from the key.
  const keyWithoutExt = key?.replace(/\.[^.]*$/, '');

  return [keyWithoutExt, file];
});

const entries = Object.fromEntries(entities);

/**
 * Gets all of the folders and returns out
 *
 * @param {string} dir Directory to check
 * @returns {string[]} List of folders
 * @private
 */
function _getFolders(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => fs.statSync(path.join(dir, file)).isDirectory());
}

/**
 * Fetches the inputs for dist
 *
 * @returns {{}} Associative array of inputs
 * @private
 */
function _getDistInputs() {
  const folders = _getFolders('src/components');
  for (let i = folders.length - 1; i >= 0; i--) {
    if (!fs.existsSync(`src/components/${folders[i]}/index.js`)) {
      folders.splice(i, 1);
    }
  }

  const inputs = {};

  folders.forEach((folder) => {
    inputs[`${folder}`] = `src/components/${folder}/index.js`;
  });

  return inputs;
}

// Library build
export default defineConfig(({ mode }) => {
  const distInputs = _getDistInputs();
  let inputs = distInputs;
  let destDir = 'dist';
  
  if (mode === 'production') {
    destDir = 'es';
    inputs = entries;
  }
  return {
    build: {
      lib: {
        entry: inputs,
        /**
         * Sets the filename
         *
         * @param {object} _ obj
         * @param {string} entryName entryname
         * @returns {string}
         */
        fileName: (_, entryName) => {
          return `${entryName}.js`;
        },
        formats: ['es']
      },
      minify: false,
      rollupOptions: {
        external: [
          /^lit/,
          /^bluebird/,
        ]
      }
    }
  }
});

// Application build
// export default defineConfig({});
