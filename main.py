import subprocess
import os

import asyncio
import aiohttp
import uuid

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin


class Plugin:
    async def get_brightness_level(self):
        brightness = int(subprocess.run(
            ["cat", "/sys/class/backlight/amdgpu_bl0/brightness"],
            timeout=10,
            text=True,
            capture_output=True,
        ).stdout)

        match brightness:
            case 40: return 0
            case 57: return 5
            case 80: return 10
            case 113: return 15
            case 159: return 20
            case 223: return 25
            case 313: return 30
            case 440: return 35
            case 617: return 40
            case 867: return 45
            case 1217: return 50
            case 1386: return 55
            case 1578: return 60
            case 1797: return 65
            case 2047: return 70
            case 2331: return 75
            case 2655: return 80
            case 3023: return 85
            case 3443: return 90
            case 3755: return 95
            case 4095: return 100

        maxBrightness = int(subprocess.run(
            ["cat", "/sys/class/backlight/amdgpu_bl0/max_brightness"],
            timeout=10,
            text=True,
            capture_output=True,
        ).stdout)

        return min(100, max(0, round(brightness / maxBrightness * 100)))

    # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
    async def add(self, left, right):
        return left + right

    async def log_info(self, message):
        decky_plugin.logger.info(message)

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(
            os.path.join(
                decky_plugin.DECKY_USER_HOME,
                ".config",
                "decky-template",
                "template.log",
            )
        )
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"),
        )
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(
                decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"
            ),
        )
