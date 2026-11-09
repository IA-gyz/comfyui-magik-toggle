from comfy_api.latest import io


class MagikToggleNode(io.ComfyNode):
    """
    A resizable boolean toggle node with customizable style and colors.
    The frontend replaces the default widget with a custom toggle UI.
    """

    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="Magik.Toggle",
            display_name="Magik Toggle",
            category="Magik/Widget",
            inputs=[
                io.Boolean.Input("value", default=False),
            ],
            outputs=[
                io.Boolean.Output("BOOLEAN", display_name=" "),
            ],
        )

    @classmethod
    def execute(cls, value):
        return io.NodeOutput(value)
