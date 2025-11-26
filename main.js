const { Plugin, moment } = require('obsidian');

// Helper function for delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class CreatedDatePlugin extends Plugin {
  onload() {
    this.registerEvent(
      this.app.vault.on('create', async (file) => {
        if (file.extension === 'md') {
          // Small delay to let templates/other plugins finish
          await sleep(100);
          
          const content = await this.app.vault.read(file);
          
          // Check if 'created' already exists in frontmatter
          if (content.includes('created:')) {
            return; // Already has created date
          }
          
          const date = moment().format('YYYY-MM-DD');
          const time = moment().format('hh:mm a');
          
          if (!content.startsWith('---')) {
            // No frontmatter, add it
            const newContent = `---\ncreated: ${date}\ntime: ${time}\n---\n\n${content}`;
            await this.app.vault.modify(file, newContent);
          } else {
            // Has frontmatter, insert created and time fields
            const lines = content.split('\n');
            const firstDashIndex = lines.findIndex(line => line === '---');
            if (firstDashIndex !== -1) {
              lines.splice(firstDashIndex + 1, 0, `created: ${date}`, `time: ${time}`);
              await this.app.vault.modify(file, lines.join('\n'));
            }
          }
        }
      })
    );
  }
};
