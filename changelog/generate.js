const readline = require('readline');
const fs = require('fs');

const jiraRegex = /\[([A-Z]{1,5})-\d{3,}\]/;
const changelogRegex = /\[[A-Z]{1,10}\]/;

// order of declaration will be order appearing in Changelog
const statements = {
    JIRA: [],
    ADDED: [],
    CHANGED: [],
    FIXED: [],
    REMOVED: [],
    DEPRECATED: [],
    CHORE: [],
    BUILD: [],
};


const matchLine = line => {
    if (line.match(jiraRegex)) {
        const ticketStart = line.indexOf('[');
        statements.JIRA.push(line.substring(ticketStart).trim());
    } else if (line.match(changelogRegex)) {
        const categoryStart = line.indexOf('[');
        const categoryEnd = line.indexOf(']', categoryStart);

        const category = line.substring(categoryStart + 1, categoryEnd);
        if (statements.hasOwnProperty(category)) {
            statements[category].push(line.substring(categoryEnd + 1).trim());
        }
    }
};

const writeChangelog = (version, filepath = 'CHANGELOG.md') => {

    const fd = fs.openSync(filepath, 'a+');

    let today = new Date().toISOString();
    today = today.substring(0, today.indexOf('T'));

    const contents = [`## [${version}] - ${today}\n`];

    for (const [key, values] of Object.entries(statements)) {
        if (values.length === 0) {
            continue;
        }

        contents.push(`### ${key}\n`);
        for (let i = 0; i < values.length; i++) {
            contents.push(`- ${values[i]}`);
        }
        contents.push('\n');
    }

    const buffer = contents.join('\n');

    fs.write(fd, buffer, 0, buffer.length, 0);
};

const main = () => {
    if (process.argv.length < 3) {
        console.log('generateChangelog.js is missing the positional TAG argument');
        console.log('USAGE: node generateChangelog.js <TAG>');
        process.exit(1);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    rl.on('line', matchLine);
    rl.on('close', () => {
        writeChangelog(process.argv[2], process.argv[3]);
    });
};

main();
