// ============================================================================
// Global Logging Utility (Development-Only)
// ============================================================================
window.TTVLLogger = (function () {
    // Environment detection
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('dev') ||
                         window.location.hostname.includes('local');

    // Colored console output for better readability (dev only)
    const styles = {
        info: 'color: #3b82f6; font-weight: bold;',    // Blue
        success: 'color: #22c55e; font-weight: bold;',  // Green
        warn: 'color: #f59e0b; font-weight: bold;',     // Orange
        error: 'color: #ef4444; font-weight: bold;',    // Red
        debug: 'color: #8b5cf6; font-weight: bold;'     // Purple
    };

    /**
     * Log info message (development only)
     * @param {string} message - Message to log
     * @param {string} [component] - Component name (optional)
     */
    const info = (message, component) => {
        if (!isDevelopment) return;
        const prefix = component ? `[${component}]` : '';
        console.log(`%c${prefix} ${message}`, styles.info);
    };

    /**
     * Log success message (development only)
     * @param {string} message - Message to log
     * @param {string} [component] - Component name (optional)
     */
    const success = (message, component) => {
        if (!isDevelopment) return;
        const prefix = component ? `[${component}]` : '';
        console.log(`%c✅ ${prefix} ${message}`, styles.success);
    };

    /**
     * Log warning message (development only)
     * @param {string} message - Message to log
     * @param {string} [component] - Component name (optional)
     */
    const warn = (message, component) => {
        if (!isDevelopment) return;
        const prefix = component ? `[${component}]` : '';
        console.warn(`%c⚠️ ${prefix} ${message}`, styles.warn);
    };

    /**
     * Log error message (development only)
     * @param {string} message - Message to log
     * @param {string} [component] - Component name (optional)
     * @param {Error} [error] - Error object (optional)
     */
    const error = (message, component, err) => {
        if (!isDevelopment) return;
        const prefix = component ? `[${component}]` : '';
        console.error(`%c❌ ${prefix} ${message}`, styles.error);
        if (err) {
            console.error('Error details:', err);
        }
    };

    /**
     * Log debug message (development only)
     * @param {string} message - Message to log
     * @param {any} [data] - Additional data to log (optional)
     */
    const debug = (message, data) => {
        if (!isDevelopment) return;
        console.log(`%c🔍 ${message}`, styles.debug);
        if (data !== undefined) {
            console.log('Data:', data);
        }
    };

    /**
     * Log group (development only)
     * @param {string} label - Group label
     * @param {Function} callback - Function to execute within group
     */
    const group = (label, callback) => {
        if (!isDevelopment) {
            callback?.();
            return;
        }
        console.group(label);
        callback?.();
        console.groupEnd();
    };

    /**
     * Get environment status
     * @returns {boolean} - True if development environment
     */
    const isDevEnvironment = () => isDevelopment;

    return {
        info,
        success,
        warn,
        error,
        debug,
        group,
        isDevEnvironment
    };
})();

// ============================================================================
// TTVL Mud Theme Library Functions
// ============================================================================
window.TTVLMudThemeLibrary = function () {
    const logger = window.TTVLLogger;

    const initScrollEvent = (dotNetHelper) => {
        window.onscroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
                dotNetHelper.invokeMethodAsync('ScrollLoadMore');
            }
        };
        logger.success('Scroll event initialized', 'TTVLMudThemeLibrary');
    };

    const copyText = (element, dotNetHelper) => {
        navigator.clipboard.writeText(element.innerText)
            .then(() => {
                dotNetHelper.invokeMethodAsync('OnCopyText', element.innerText);
                logger.success('Text copied to clipboard', 'TTVLMudThemeLibrary');
            })
            .catch(err => {
                logger.error('Failed to copy text', 'TTVLMudThemeLibrary', err);
            });
    };

    const beautifyHtml = async (html) => {
        let waitForHtmlBeautify = async () => {
            while (typeof html_beautify !== "function") {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            return html_beautify;
        };

        try {
            const beautifier = await waitForHtmlBeautify();
            const result = beautifier(html, {
                indent_size: 4,
                wrap_line_length: Infinity, // Không ngắt xuống dòng. Nếu cho giá trị là 120, có nghĩa là dài hơn 120 ký tự sẽ tự động xuống dòng
                preserve_newlines: true
            });
            logger.success('HTML beautified successfully', 'TTVLMudThemeLibrary');
            return result;
        } catch (error) {
            logger.error('Failed to beautify HTML', 'TTVLMudThemeLibrary', error);
            return html;
        }
    };

    const formatJson = async (code) => {
        try {
            const formatted = JSON.stringify(JSON.parse(code), null, 4);
            logger.success('JSON formatted successfully', 'TTVLMudThemeLibrary');
            return formatted;
        } catch (e) {
            logger.warn('Invalid JSON, skipping beautify', 'TTVLMudThemeLibrary');
            return code;
        }
    };

    const formatCsharp = async (code) => {
        if (!code) {
            code = "";
        }
        try {
            const res = await fetch('https://server.ttvl.io.vn/api/format-code/csharp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(code)
            });
            
            if (res.ok) {
                logger.success('C# code formatted successfully', 'TTVLMudThemeLibrary');
                return await res.text();
            } else {
                logger.warn(`Failed to format C# code: ${res.status}`, 'TTVLMudThemeLibrary');
                return code;
            }
        } catch (error) {
            logger.error('Error formatting C# code', 'TTVLMudThemeLibrary', error);
            return code;
        }
    };

    const forceDownload = function (url, fileName) {
        fetch(url, { mode: 'cors' })
            .then(resp => resp.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName || "download";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                logger.success(`File downloaded: ${fileName}`, 'TTVLMudThemeLibrary');
            })
            .catch(error => {
                logger.error('Failed to download file', 'TTVLMudThemeLibrary', error);
            });
    };

    return {
        initScrollEvent,
        copyText,
        beautifyHtml,
        formatJson,
        formatCsharp,
        forceDownload
    };
}();