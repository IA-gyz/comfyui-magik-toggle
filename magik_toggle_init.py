# __init__.py
# Magik Toggle Node - ComfyUI custom node

from typing_extensions import override
from comfy_api.latest import ComfyExtension, io

from .magik_toggle import MagikToggleNode


class MagikToggleExtension(ComfyExtension):
    @override
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [MagikToggleNode]


async def comfy_entrypoint() -> MagikToggleExtension:
    return MagikToggleExtension()


# Serve the JavaScript / CSS assets from the 'js' subfolder
WEB_DIRECTORY = "js"
