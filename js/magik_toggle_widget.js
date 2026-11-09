import { app } from "../../scripts/app.js";

const MagikToggleExtension = {
    name: "CRT.MagikToggle.UI",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "Magik.Toggle") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;

            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);

                // Make node background and title transparent
                this.bgcolor = "transparent";
                this.color = "transparent";

                // Find the original boolean widget
                const valueWidget = this.widgets.find(w => w.name === "value");
                valueWidget.hidden = true;

                // Initialize properties
                this.properties = this.properties || {};
                this.properties.title = this.properties.title || "";
                this.properties.color_on = this.properties.color_on || "#00ff88";
                this.properties.color_off = this.properties.color_off || "#ff4444";
                this.properties.style = this.properties.style || "switch";
                this.properties.on_text = this.properties.on_text || "ON";
                this.properties.off_text = this.properties.off_text || "OFF";

                // Set an initial size
                this.size = this.size || [300, 200];

                // --- UI Construction ---
                const wrapper = document.createElement("div");
                wrapper.className = "magik-toggle-wrapper";
                wrapper.style.position = 'absolute';
                wrapper.style.top = '0';
                wrapper.style.left = '0';
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column'; // changed to column
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'flex-start'; // items from top
                wrapper.style.background = 'transparent';
                wrapper.style.pointerEvents = 'none';

                const style = document.createElement("style");
                style.textContent = `
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');
                    
                    .magik-toggle-wrapper { 
                        font-family: 'Orbitron', monospace;
                        user-select: none;
                    }
                    
                    .magik-toggle-header {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 5px;
                        box-sizing: border-box;
                        pointer-events: none;
                    }
                    
                    .magik-toggle-settings-btn { 
                        background: rgba(255, 255, 255, 0.1); 
                        color: var(--toggle-color, #888); 
                        border: 1px solid var(--toggle-color, #888); 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-size: 16px; 
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: auto;
                        z-index: 10;
                    }
                    
                    .magik-toggle-settings-btn:hover { 
                        background: var(--toggle-color, #888); 
                        color: white; 
                        transform: scale(1.1);
                        box-shadow: 0 0 15px var(--toggle-color, #888);
                    }
                    
                    .magik-toggle-title { 
                        color: var(--toggle-color, #888); 
                        font-family: 'Orbitron', monospace;
                        font-weight: bold; 
                        text-shadow: 0 0 8px var(--toggle-color, #888);
                        pointer-events: none;
                        flex: 1;
                        text-align: left;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    
                    .toggle-switch, .toggle-button, .toggle-checkbox {
                        pointer-events: auto;
                        transition: all 0.3s ease;
                        box-shadow: 
                            inset 0 0 20px rgba(0, 0, 0, 0.8),
                            0 8px 20px rgba(0, 0, 0, 0.6);
                    }
                    
                    .toggle-switch {
                        background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                        border: 3px solid var(--toggle-color, #888);
                        border-radius: 30px;
                        position: relative;
                        cursor: pointer;
                    }
                    
                    .toggle-switch:hover {
                        transform: scale(1.05);
                        box-shadow: 
                            inset 0 0 20px rgba(0, 0, 0, 0.8),
                            0 12px 25px rgba(0, 0, 0, 0.7),
                            0 0 15px var(--toggle-color, #888);
                    }
                    
                    .toggle-switch-handle {
                        background: radial-gradient(circle at 30% 30%, #ffffff, #cccccc);
                        border-radius: 50%;
                        position: absolute;
                        top: 3px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                        border: 2px solid var(--toggle-color, #888);
                        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    .toggle-switch-text {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 12px;
                        font-weight: bold;
                        color: var(--toggle-color, #888);
                        text-shadow: 0 0 5px var(--toggle-color, #888);
                        transition: all 0.3s ease;
                        pointer-events: none;
                    }
                    
                    .toggle-switch-text.on-text {
                        left: 15px;
                        opacity: 0;
                    }
                    
                    .toggle-switch-text.off-text {
                        right: 10px;
                        opacity: 1;
                    }
                    
                    .toggle-switch.on .toggle-switch-text.on-text {
                        opacity: 1;
                    }
                    
                    .toggle-switch.on .toggle-switch-text.off-text {
                        opacity: 0;
                    }
                    
                    .toggle-button {
                        background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                        border: 3px solid var(--toggle-color, #888);
                        border-radius: 15px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: var(--toggle-color, #888);
                        text-shadow: 0 0 8px var(--toggle-color, #888);
                    }
                    
                    .toggle-button:hover {
                        transform: scale(1.05);
                        box-shadow: 
                            inset 0 0 20px rgba(0, 0, 0, 0.8),
                            0 12px 25px rgba(0, 0, 0, 0.7),
                            0 0 15px var(--toggle-color, #888);
                    }
                    
                    .toggle-button.on {
                        background: linear-gradient(145deg, var(--toggle-color, #888), var(--toggle-color-dark, #666));
                        color: white;
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                    }
                    
                    .toggle-checkbox {
                        background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                        border: 3px solid var(--toggle-color, #888);
                        border-radius: 10px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    }
                    
                    .toggle-checkbox:hover {
                        transform: scale(1.05);
                        box-shadow: 
                            inset 0 0 20px rgba(0, 0, 0, 0.8),
                            0 12px 25px rgba(0, 0, 0, 0.7),
                            0 0 15px var(--toggle-color, #888);
                    }
                    
                    .toggle-checkbox-check {
                        font-size: 30px;
                        color: var(--toggle-color, #888);
                        opacity: 0;
                        transition: all 0.3s ease;
                        text-shadow: 0 0 10px var(--toggle-color, #888);
                    }
                    
                    .toggle-checkbox.on .toggle-checkbox-check {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                    
                    /* Modal Styles (unchanged) */
                    .magik-toggle-modal-overlay { 
                        position: fixed; 
                        top: 0; 
                        left: 0; 
                        width: 100%; 
                        height: 100%; 
                        background: rgba(0,0,0,0.8); 
                        z-index: 10000; 
                        display: none; 
                        align-items: center; 
                        justify-content: center; 
                        backdrop-filter: blur(5px);
                    }
                    
                    .magik-toggle-modal { 
                        background: linear-gradient(145deg, #2a2a2a, #1a1a1a); 
                        border: 2px solid #888; 
                        border-radius: 15px; 
                        padding: 25px; 
                        display: flex; 
                        flex-direction: column; 
                        gap: 15px; 
                        min-width: 350px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
                        font-family: 'Orbitron', monospace;
                    }
                    
                    .magik-toggle-modal-row { 
                        display: grid; 
                        grid-template-columns: 100px 1fr; 
                        align-items: center; 
                        gap: 15px; 
                    }
                    
                    .magik-toggle-modal-row label { 
                        color: rgba(255, 255, 255, 0.8); 
                        font-size: 12px; 
                        font-weight: 500;
                    }
                    
                    .magik-toggle-modal-row input, .magik-toggle-modal-row select { 
                        background: rgba(0, 0, 0, 0.5); 
                        border: 1px solid #888; 
                        color: white; 
                        padding: 8px 12px; 
                        border-radius: 6px; 
                        font-size: 12px;
                        font-family: 'Orbitron', monospace;
                        transition: all 0.3s ease;
                    }
                    
                    .magik-toggle-modal-row input:focus, .magik-toggle-modal-row select:focus {
                        outline: none;
                        border-color: #ffffff;
                        box-shadow: 0 0 10px #888;
                    }
                    
                    .magik-toggle-modal-buttons { 
                        display: flex; 
                        justify-content: flex-end; 
                        gap: 10px; 
                        margin-top: 10px; 
                    }
                    
                    .magik-toggle-modal-button {
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid #888;
                        border-radius: 6px;
                        color: #888;
                        padding: 8px 16px;
                        cursor: pointer;
                        font-size: 12px;
                        font-family: 'Orbitron', monospace;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                    }
                    
                    .magik-toggle-modal-button:hover {
                        background: #888;
                        color: white;
                    }
                    
                    .magik-toggle-modal-button.save {
                        background: #888;
                        color: white;
                    }
                    
                    .magik-toggle-modal-title {
                        color: #888;
                        font-size: 16px;
                        font-weight: 700;
                        text-align: center;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                `;
                wrapper.appendChild(style);

                // Header row with settings button and title
                const header = document.createElement("div");
                header.className = "magik-toggle-header";
                header.style.pointerEvents = 'none';

                const settingsBtn = document.createElement("button");
                settingsBtn.className = "magik-toggle-settings-btn";
                settingsBtn.innerHTML = "⚙";
                this.settingsBtn = settingsBtn;

                const titleDisplay = document.createElement("div");
                titleDisplay.className = "magik-toggle-title";
                titleDisplay.textContent = this.properties.title;

                header.appendChild(settingsBtn);
                header.appendChild(titleDisplay);

                // Toggle element (will be populated later)
                const toggleElement = document.createElement("div");
                this.updateToggleStyle(toggleElement);

                wrapper.appendChild(header);
                wrapper.appendChild(toggleElement);

                // Add DOM widget
                const domWidget = this.addDOMWidget("magik_toggle_ui", "div", wrapper, { serialize: false });
                domWidget.element.style.pointerEvents = 'none';
                domWidget.wrapper = wrapper;

                // Make the node's container the positioning context for the settings button (already in header)
                domWidget.element.style.position = 'relative';

                // ResizeObserver to adapt toggle size to container (updated)
                const updateToggleLayout = () => {
                    const container = domWidget.element;
                    const w = container.clientWidth;
                    const h = container.clientHeight;
                    if (w === 0 || h === 0) return;

                    // Settings button size
                    const btnSize = Math.max(20, Math.min(4000, Math.min(w, h) * 0.1));
                    settingsBtn.style.width = btnSize + 'px';
                    settingsBtn.style.height = btnSize + 'px';
                    settingsBtn.style.fontSize = (btnSize * 0.6) + 'px';

                    // Title font size proportional to button
                    const titleFontSize = btnSize * 0.5;
                    titleDisplay.style.fontSize = titleFontSize + 'px';
                    titleDisplay.style.lineHeight = btnSize + 'px';

                    // Header height (button height + padding)
                    const headerHeight = btnSize + 10; // 5px padding top/bottom

                    // Available height for toggle = total height minus header
                    const availableHeight = h - headerHeight;
                    const availableWidth = w;

                    // Toggle sizing (using 90% of available space)
                    const maxW = availableWidth * 0.9;
                    const maxH = availableHeight * 0.9;

                    let toggleWidth, toggleHeight, handleSize, fontSize;

                    if (this.properties.style === "switch") {
                        toggleHeight = Math.min(maxH, maxW / 2);
                        toggleWidth = toggleHeight * 2;
                        handleSize = toggleHeight * 0.8;
                        fontSize = toggleHeight * 0.25;
                    } else if (this.properties.style === "button") {
                        toggleHeight = Math.min(maxH, maxW / 2.5);
                        toggleWidth = toggleHeight * 2.5;
                        fontSize = toggleHeight * 0.4;
                    } else { // checkbox
                        toggleHeight = Math.min(maxH, maxW);
                        toggleWidth = toggleHeight;
                        fontSize = toggleHeight * 0.5;
                    }

                    toggleElement.style.width = toggleWidth + 'px';
                    toggleElement.style.height = toggleHeight + 'px';

                    // Switch-specific adjustments
                    if (this.properties.style === "switch") {
                        const handle = toggleElement.querySelector('.toggle-switch-handle');
                        const onText = toggleElement.querySelector('.toggle-switch-text.on-text');
                        const offText = toggleElement.querySelector('.toggle-switch-text.off-text');

                        if (handle) {
                            handle.style.width = handleSize + 'px';
                            handle.style.height = handleSize + 'px';
                            handle.style.top = (toggleHeight - handleSize) / 2 + 'px';
                            const isOn = valueWidget.value;
                            handle.style.left = isOn ? (toggleWidth - handleSize - 6) + 'px' : '6px';
                        }
                        if (onText) {
                            onText.style.fontSize = fontSize + 'px';
                            onText.style.left = '10px';
                        }
                        if (offText) {
                            offText.style.fontSize = fontSize + 'px';
                            offText.style.right = '10px';
                        }
                    } else if (this.properties.style === "button") {
                        toggleElement.style.fontSize = fontSize + 'px';
                    } else if (this.properties.style === "checkbox") {
                        const check = toggleElement.querySelector('.toggle-checkbox-check');
                        if (check) {
                            check.style.fontSize = fontSize + 'px';
                        }
                    }
                };

                this._resizeObserver = new ResizeObserver(() => {
                    updateToggleLayout();
                });
                this._resizeObserver.observe(domWidget.element);

                // Modal for Settings
                const modalOverlay = document.createElement("div");
                modalOverlay.className = "magik-toggle-modal-overlay";
                const modal = this.buildModal(modalOverlay);
                document.body.appendChild(modalOverlay);

                // Logic and Event Handling
                const updateToggleVisuals = () => {
                    const isOn = valueWidget.value;
                    const color = isOn ? this.properties.color_on : this.properties.color_off;
                    wrapper.style.setProperty("--toggle-color", color);

                    const darkColor = this.darkenColor(color, 0.3);
                    wrapper.style.setProperty("--toggle-color-dark", darkColor);

                    if (this.properties.style === "switch") {
                        toggleElement.classList.toggle("on", isOn);
                        const handle = toggleElement.querySelector('.toggle-switch-handle');
                        if (handle) {
                            const toggleWidth = parseFloat(toggleElement.style.width);
                            const handleSize = parseFloat(handle.style.width);
                            if (!isNaN(toggleWidth) && !isNaN(handleSize)) {
                                handle.style.left = isOn ? (toggleWidth - handleSize - 6) + 'px' : '6px';
                            }
                        }
                    } else if (this.properties.style === "button") {
                        toggleElement.classList.toggle("on", isOn);
                        toggleElement.textContent = isOn ? this.properties.on_text : this.properties.off_text;
                    } else if (this.properties.style === "checkbox") {
                        toggleElement.classList.toggle("on", isOn);
                    }
                };

                const toggleValue = () => {
                    valueWidget.value = !valueWidget.value;
                    valueWidget.callback?.(valueWidget.value);
                    updateToggleVisuals();
                };

                const updateAllVisuals = () => {
                    titleDisplay.textContent = this.properties.title;
                    this.updateToggleStyle(toggleElement);
                    updateToggleLayout();
                    updateToggleVisuals();
                };

                toggleElement.addEventListener("click", (e) => {
                    toggleValue();
                    e.preventDefault();
                    e.stopPropagation();
                });

                settingsBtn.addEventListener("click", (e) => {
                    modal.show();
                    modalOverlay.style.display = "flex";
                    e.preventDefault();
                    e.stopPropagation();
                });

                // Canvas pan/zoom passthrough: let wheel and middle-mouse
                // drag still reach the LiteGraph canvas when hovering the
                // toggle control, same pattern as Magik Mega Panel.
                const forwardWheelToLiteGraph = (e) => {
                    const canvas = app.canvas;
                    if (!canvas) return;
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof canvas.processMouseWheel === "function") {
                        canvas.processMouseWheel(e);
                        return;
                    }
                    const canvasEl = canvas.canvas;
                    if (!canvasEl) return;
                    canvasEl.dispatchEvent(new WheelEvent("wheel", {
                        deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ,
                        deltaMode: e.deltaMode,
                        clientX: e.clientX, clientY: e.clientY,
                        screenX: e.screenX, screenY: e.screenY,
                        ctrlKey: e.ctrlKey, shiftKey: e.shiftKey,
                        altKey: e.altKey, metaKey: e.metaKey,
                        bubbles: true, cancelable: true, composed: true,
                    }));
                };

                const maybeStartCanvasPan = (e) => {
                    if (e.button !== 1) return;
                    const canvas = app.canvas;
                    if (!canvas || typeof canvas.processMouseDown !== "function") return;
                    e.preventDefault();
                    e.stopPropagation();
                    canvas.processMouseDown(e);
                };

                wrapper.addEventListener("wheel", forwardWheelToLiteGraph, { passive: false });
                wrapper.addEventListener("pointerdown", maybeStartCanvasPan);

                updateAllVisuals();

                // Store references
                this.syncToggleUI = updateAllVisuals;
                this.toggleElement = toggleElement;
                this.valueWidget = valueWidget;
                this.wrapper = wrapper;
                this.titleDisplay = titleDisplay;
            };

            // Helper: update toggle style (unchanged)
            nodeType.prototype.updateToggleStyle = function(toggleElement) {
                toggleElement.className = "";
                toggleElement.innerHTML = "";

                if (this.properties.style === "switch") {
                    toggleElement.className = "toggle-switch";

                    const handle = document.createElement("div");
                    handle.className = "toggle-switch-handle";

                    const onText = document.createElement("div");
                    onText.className = "toggle-switch-text on-text";
                    onText.textContent = this.properties.on_text;

                    const offText = document.createElement("div");
                    offText.className = "toggle-switch-text off-text";
                    offText.textContent = this.properties.off_text;

                    toggleElement.appendChild(handle);
                    toggleElement.appendChild(onText);
                    toggleElement.appendChild(offText);

                } else if (this.properties.style === "button") {
                    toggleElement.className = "toggle-button";
                    toggleElement.textContent = this.properties.off_text;

                } else if (this.properties.style === "checkbox") {
                    toggleElement.className = "toggle-checkbox";

                    const check = document.createElement("div");
                    check.className = "toggle-checkbox-check";
                    check.innerHTML = "✓";

                    toggleElement.appendChild(check);
                }
            };

            // Helper: darken a color (unchanged)
            nodeType.prototype.darkenColor = function(color, factor) {
                const hex = color.replace('#', '');
                const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
                const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
                const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
                return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
            };

            // Helper: build settings modal (unchanged)
            nodeType.prototype.buildModal = function(overlay) {
                const modal = document.createElement("div");
                modal.className = "magik-toggle-modal";

                const title = document.createElement("div");
                title.className = "magik-toggle-modal-title";
                title.textContent = "Toggle Settings";
                modal.appendChild(title);

                const createRow = (labelText, input) => {
                    const row = document.createElement("div");
                    row.className = "magik-toggle-modal-row";
                    const label = document.createElement("label");
                    label.textContent = labelText;
                    row.appendChild(label);
                    row.appendChild(input);
                    return row;
                };

                const titleInput = document.createElement("input");
                const onTextInput = document.createElement("input");
                const offTextInput = document.createElement("input");
                const colorOnInput = document.createElement("input");
                colorOnInput.type = "color";
                const colorOffInput = document.createElement("input");
                colorOffInput.type = "color";

                const styleSelect = document.createElement("select");
                ["switch", "button", "checkbox"].forEach(style => {
                    const option = document.createElement("option");
                    option.value = style;
                    option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
                    styleSelect.appendChild(option);
                });

                modal.appendChild(createRow("Title:", titleInput));
                modal.appendChild(createRow("Style:", styleSelect));
                modal.appendChild(createRow("ON Text:", onTextInput));
                modal.appendChild(createRow("OFF Text:", offTextInput));
                modal.appendChild(createRow("ON Color:", colorOnInput));
                modal.appendChild(createRow("OFF Color:", colorOffInput));

                const buttons = document.createElement("div");
                buttons.className = "magik-toggle-modal-buttons";
                const saveBtn = document.createElement("button");
                saveBtn.className = "magik-toggle-modal-button save";
                saveBtn.textContent = "Save";
                const cancelBtn = document.createElement("button");
                cancelBtn.className = "magik-toggle-modal-button";
                cancelBtn.textContent = "Cancel";

                buttons.appendChild(cancelBtn);
                buttons.appendChild(saveBtn);
                modal.appendChild(buttons);
                overlay.appendChild(modal);

                const hide = () => overlay.style.display = "none";
                const show = () => {
                    titleInput.value = this.properties.title;
                    styleSelect.value = this.properties.style;
                    onTextInput.value = this.properties.on_text;
                    offTextInput.value = this.properties.off_text;
                    colorOnInput.value = this.properties.color_on;
                    colorOffInput.value = this.properties.color_off;
                };

                cancelBtn.addEventListener("click", hide);
                overlay.addEventListener("click", (e) => { if (e.target === overlay) hide(); });
                saveBtn.addEventListener("click", () => {
                    this.properties.title = titleInput.value;
                    this.properties.style = styleSelect.value;
                    this.properties.on_text = onTextInput.value;
                    this.properties.off_text = offTextInput.value;
                    this.properties.color_on = colorOnInput.value;
                    this.properties.color_off = colorOffInput.value;
                    this.syncToggleUI();
                    hide();
                });

                return { show, hide };
            };

            // Clean up observer on node removal
            const onRemoved = nodeType.prototype.onRemoved;
            nodeType.prototype.onRemoved = function () {
                if (this._resizeObserver) {
                    this._resizeObserver.disconnect();
                    delete this._resizeObserver;
                }
                onRemoved?.apply(this, arguments);
            };

            // Serialization hook
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function(info) {
                onConfigure?.apply(this, arguments);
                if (this.syncToggleUI) {
                    this.syncToggleUI();
                }
            };
        }
    }
};

app.registerExtension(MagikToggleExtension);
