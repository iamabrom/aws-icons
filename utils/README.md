# AWS Icons Utility Scripts

## Convert SVGs to PNGs

The default AWS resource icons currently include PNG files with 48px resolution. Use the [svg-to-png.sh](https://github.com/iamabrom/aws-icons/blob/main/utils/svg-to-png.sh) script to batch convert the SVG sources files into large PNG files.

This relies on the FOSS [Inkscape](https://inkscape.org/) application. More specifically, it relies on [Inkscape CLI](https://wiki.inkscape.org/wiki/Using_the_Command_Line).

**Usage**:

```shell
$ bash svg-to-png.sh <sourceDirectory> <destinationDirectory> <imageSize>
```

**Example**:
```shell
$ bash svg-to-png.sh ./Asset-Package ./Asset-Package-Processed 250
```

This script will also generate a log file within the active directly in which you are running this script from.

Depending on your OS, you may have to modify the script to point to the binary. For example if running on MacOS your binary may be located here: `INKSCAPE_BIN="/Applications/Inkscape.app/Contents/MacOS/inkscape"`

Within the script file you would need to update `INKSCAPE_BIN` to the location of where the Inkscape binary is installed on your machine.

