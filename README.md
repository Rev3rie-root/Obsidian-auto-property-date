# Obsidian-auto-property-date

This plugin addes a date and time automatically with a delay. From past experienes, I kept transfering files back and forth on my iOS to my chromebook. When I noticed that my files don't show the past date created, I worked on making the plugin for help. 

## Features

- Automatically adds creation date in `YYYY-MM-DD` format
- Automatically adds creation time in `hh:mm a` format (e.g., "02:30 PM")
- Only affects newly created notes (does not modify existing files)
- Works seamlessly in the background

## Installation

### Via BRAT (Beta Reviewers Auto-update Tester)

1. Install the BRAT plugin from Obsidian's Community Plugins
2. In BRAT settings, click "Add Beta plugin"
3. Enter: `https://github.com/Rev3rie-root/Obsidian-auto-property-date`
4. Enable the plugin in Community Plugins settings

## Usage

Once enabled, the plugin works automatically. Every time you create a new note, it will add frontmatter like this:
```yaml
---
created: 2025-11-26
time: 02:30 PM
---
```
