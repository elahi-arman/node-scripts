# CHANGELOG SCRIPST

## GENERATE CHANGELOG

This script will generate a changelog based off the [Keep A Changelog](https://keepachangelog.com/en/1.0.0/) format. 

To get the changelog for everything from the last tag forward, you can use the following command

``` bash
git log $(git describe --tags --abbrev=0)..HEAD | node <path_to_repo>/build/changelog/generate.js <version>
```

The script has the following options

```bash
node <path_to_repo>/build/changelog/generate.js <version> <output_file>
```

The CHANGELOG will be prepended to <output_file> with the first line being the `[${version}] - ${ISO String}`
