const { Plugin, moment } = require('obsidian');

module.exports = class CreatedDatePlugin extends Plugin {
  onload() {
    this.registerEvent(
      this.app.vault.on('create', (file) => {
        if (file.extension === 'md') {
          this.app.vault.read(file).then((content) => {
            // Only add frontmatter if it doesn't already exist
            if (!content.startsWith('---')) {
              const date = moment().format('YYYY-MM-DD');
              const newContent = `---\ncreated: ${date}\n---\n\n${content}`;
              this.app.vault.modify(file, newContent);
            }
          });
        }
      })
    );
  }
};
