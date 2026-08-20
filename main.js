const { Plugin, moment } = require('obsidian');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class CreatedDatePlugin extends Plugin {
  onload() {
    this.registerEvent(
      this.app.vault.on('create', async (file) => {
        // Only work with Markdown files.
        if (file.extension !== 'md') return;

        // Ignore files that are not genuinely new.
        const ageMs = Date.now() - file.stat.ctime;
        if (ageMs > 3000) return;

        // Give templates and other plugins a moment to finish.
        await sleep(100);

        const content = await this.app.vault.read(file);

        // Look specifically for YAML frontmatter.
        const frontmatterMatch = content.match(
          /^---\r?\n([\s\S]*?)\r?\n---/
        );

        const frontmatterText = frontmatterMatch
          ? frontmatterMatch[1]
          : '';

        // Check the two properties separately.
        const hasCreated = /^created\s*:/m.test(frontmatterText);
        const hasTime = /^time\s*:/m.test(frontmatterText);

        // Existing created property means the file is already handled.
        if (hasCreated) return;

        const date = moment().format('YYYY-MM-DD');
        const time = moment().format('hh:mm a');

        // No frontmatter exists.
        if (!frontmatterMatch) {
          const newContent = [
            '---',
            `created: ${date}`,
            `time: ${time}`,
            '---',
            '',
            content
          ].join('\n');

          await this.app.vault.modify(file, newContent);
          return;
        }

        // Existing frontmatter.
        const lines = content.split(/\r?\n/);

        // Add created because it doesn't exist.
        const propertiesToAdd = [`created: ${date}`];

        // Preserve an existing time property.
        if (!hasTime) {
          propertiesToAdd.push(`time: ${time}`);
        }

        // Insert the new properties directly after the opening ---.
        lines.splice(1, 0, ...propertiesToAdd);

        await this.app.vault.modify(file, lines.join('\n'));
      })
    );
  }
};
