// Sử dụng logger tập trung từ site.js
const log = window.TTVLLogger || {
    info: () => { },
    success: () => { },
    warn: () => { },
    error: () => { }
};

const COMPONENT_NAME = 'Cropperjs';

/**
 * Module Cropper.js Image Editor
 * Cách dùng: await module.InvokeVoidAsync("Cropperjs.init", ...)
 * Docs: https://fengyuanchen.github.io/cropperjs/
 */
export const Cropperjs = (function () {
    // Lưu trữ private
    const croppers = {};
    let nextId = 1;

    /**
     * Helper: Load CSS file dynamically
     * @param {string} url - CSS file URL
     * @returns {Promise}
     */
    const loadCss = function(url) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            const existing = document.querySelector(`link[href="${url}"]`);
            if (existing) {
                log.info(`CSS already loaded: ${url}`, COMPONENT_NAME);
                resolve();
                return;
            }

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;

            link.onload = () => {
                log.success(`CSS loaded: ${url}`, COMPONENT_NAME);
                resolve();
            };

            link.onerror = () => {
                log.error(`Failed to load CSS: ${url}`, COMPONENT_NAME);
                reject(new Error(`Failed to load ${url}`));
            };

            // Insert at beginning of head
            document.head.insertBefore(link, document.head.firstChild);
        });
    };

    /**
     * Helper: Load JavaScript file dynamically
     * @param {string} url - JS file URL
     * @returns {Promise}
     */
    const loadJs = function(url) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            const existing = document.querySelector(`script[src="${url}"]`);
            if (existing) {
                log.info(`JS already loaded: ${url}`, COMPONENT_NAME);
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = url;
            script.defer = true;

            script.onload = () => {
                log.success(`JS loaded: ${url}`, COMPONENT_NAME);
                resolve();
            };

            script.onerror = () => {
                log.error(`Failed to load JS: ${url}`, COMPONENT_NAME);
                reject(new Error(`Failed to load ${url}`));
            };

            document.body.appendChild(script);
        });
    };

    /**
     * Preload Cropper.js library
     * @returns {Promise} Promise khi library sẵn sàng
     */
    const preload = async function () {
        if (window.__cropperjs_loaderPromise) {
            log.info('Cropperjs library đã được preload', COMPONENT_NAME);
            return window.__cropperjs_loaderPromise;
        }

        log.info('Bắt đầu preload Cropperjs library...', COMPONENT_NAME);

        window.__cropperjs_loaderPromise = (async () => {
            try {
                // Load CSS and JS in parallel
                await Promise.all([
                    loadJs("_content/TTVLDashboard.SharedLibrary/plugins/cropperjs/cropper.js"),
                    loadCss("_content/TTVLDashboard.SharedLibrary/plugins/cropperjs/cropper.css")
                ]);

                log.success('Preload Cropperjs library thành công', COMPONENT_NAME);
            } catch (error) {
                log.error('Lỗi khi preload Cropperjs library', COMPONENT_NAME, error);
                throw error;
            }
        })();

        return window.__cropperjs_loaderPromise;
    };

    /**
     * Chờ cho đến khi window.Cropper có sẵn
     * @returns {Promise} Promise khi Cropper library ready
     */
    const waitForCropper = async function () {
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds timeout

        while (typeof window.Cropper === "undefined") {
            if (attempts >= maxAttempts) {
                const error = 'Timeout: Cropperjs library không load được sau 10 giây';
                log.error(error, COMPONENT_NAME);
                throw new Error(error);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;

            if (attempts % 4 === 0) {
                log.info(`Đang chờ Cropperjs library... (${attempts * 0.5}s)`, COMPONENT_NAME);
            }
        }

        log.success('Cropperjs library đã sẵn sàng', COMPONENT_NAME);
    };

    /**
     * Khởi tạo Cropper instance
     * @param {HTMLImageElement} imageRef - Image element để crop
     * @param {Object} options - Cropper options
     * @returns {string} ID của cropper instance
     */
    const init = async function (imageRef, options = {}) {
        try {
            if (!imageRef) {
                log.error('Image element không tồn tại', COMPONENT_NAME);
                throw new Error('Image element is required');
            }

            log.info('Đang khởi tạo Cropperjs...', COMPONENT_NAME);

            await waitForCropper();

            // Default options
            const defaultOptions = {
                aspectRatio: NaN, // Free aspect ratio
                viewMode: 1,      // Restrict crop box within canvas
                dragMode: 'move', // Move canvas
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: true,
            };

            // Merge options
            const finalOptions = { ...defaultOptions, ...options };

            // Create cropper instance
            const cropper = new window.Cropper(imageRef, finalOptions);

            // Generate unique ID
            const cropperId = `cropper_${nextId++}`;
            croppers[cropperId] = cropper;

            log.success(`Khởi tạo Cropperjs thành công (ID: ${cropperId})`, COMPONENT_NAME);

            return cropperId;

        } catch (error) {
            log.error('Lỗi khi khởi tạo Cropperjs', COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Lấy cropped canvas dưới dạng base64
     * @param {string} cropperId - ID của cropper instance
     * @param {Object} options - Canvas options
     * @returns {string} Base64 image data
     */
    const getCroppedCanvas = function (cropperId, options = {}) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return null;
            }

            const defaultOptions = {
                maxWidth: 4096,
                maxHeight: 4096,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            };

            const finalOptions = { ...defaultOptions, ...options };
            const canvas = cropper.getCroppedCanvas(finalOptions);

            if (canvas instanceof HTMLCanvasElement) {
                const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
                log.info(`Đã lấy cropped canvas (size: ${(dataUrl.length / 1024).toFixed(2)} KB)`, COMPONENT_NAME);
                return dataUrl;
            }

            log.warn('getCroppedCanvas không trả về canvas', COMPONENT_NAME);
            return null;

        } catch (error) {
            log.error(`Lỗi khi lấy cropped canvas từ '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Xoay ảnh
     * @param {string} cropperId - ID của cropper instance
     * @param {number} degree - Số độ xoay (-360 đến 360)
     */
    const rotate = function (cropperId, degree) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.rotate(degree);
            log.info(`Xoay ảnh ${degree}° (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi xoay ảnh '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Lật ảnh theo chiều ngang
     * @param {string} cropperId - ID của cropper instance
     * @param {number} scaleX - Scale X value (-1 hoặc 1)
     */
    const scaleX = function (cropperId, scaleX) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.scaleX(scaleX);
            log.info(`Lật ảnh ngang (scaleX: ${scaleX}, ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi lật ảnh ngang '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Lật ảnh theo chiều dọc
     * @param {string} cropperId - ID của cropper instance
     * @param {number} scaleY - Scale Y value (-1 hoặc 1)
     */
    const scaleY = function (cropperId, scaleY) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.scaleY(scaleY);
            log.info(`Lật ảnh dọc (scaleY: ${scaleY}, ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi lật ảnh dọc '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Zoom ảnh
     * @param {string} cropperId - ID của cropper instance
     * @param {number} ratio - Zoom ratio (>0: zoom in, <0: zoom out)
     */
    const zoom = function (cropperId, ratio) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.zoom(ratio);
            log.info(`Zoom ảnh (ratio: ${ratio}, ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi zoom ảnh '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Reset cropper về trạng thái ban đầu
     * @param {string} cropperId - ID của cropper instance
     */
    const reset = function (cropperId) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.reset();
            log.info(`Reset cropper (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi reset cropper '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Clear crop area
     * @param {string} cropperId - ID của cropper instance
     */
    const clear = function (cropperId) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.clear();
            log.info(`Clear crop area (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi clear crop area '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Disable cropper
     * @param {string} cropperId - ID của cropper instance
     */
    const disable = function (cropperId) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.disable();
            log.info(`Disable cropper (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi disable cropper '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Enable cropper
     * @param {string} cropperId - ID của cropper instance
     */
    const enable = function (cropperId) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.enable();
            log.info(`Enable cropper (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi enable cropper '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Set aspect ratio
     * @param {string} cropperId - ID của cropper instance
     * @param {number} aspectRatio - Aspect ratio (VD: 16/9, 4/3, 1, NaN for free)
     */
    const setAspectRatio = function (cropperId, aspectRatio) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.setAspectRatio(aspectRatio);
            log.info(`Set aspect ratio: ${aspectRatio} (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi set aspect ratio '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Set drag mode
     * @param {string} cropperId - ID của cropper instance
     * @param {string} mode - 'crop', 'move', or 'none'
     */
    const setDragMode = function (cropperId, mode) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.setDragMode(mode);
            log.info(`Set drag mode: ${mode} (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi set drag mode '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Get crop box data
     * @param {string} cropperId - ID của cropper instance
     * @returns {Object} Crop box data {left, top, width, height}
     */
    const getCropBoxData = function (cropperId) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return null;
            }

            const data = cropper.getCropBoxData();
            log.info(`Get crop box data (ID: ${cropperId})`, COMPONENT_NAME);
            return data;

        } catch (error) {
            log.error(`Lỗi khi get crop box data '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Set crop box data
     * @param {string} cropperId - ID của cropper instance
     * @param {Object} data - Crop box data {left, top, width, height}
     */
    const setCropBoxData = function (cropperId, data) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.warn(`Cropper instance '${cropperId}' không tồn tại`, COMPONENT_NAME);
                return;
            }

            cropper.setCropBoxData(data);
            log.info(`Set crop box data (ID: ${cropperId})`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi set crop box data '${cropperId}'`, COMPONENT_NAME, error);
            throw error;
        }
    };

    /**
     * Dispose cropper instance và giải phóng tài nguyên
     * @param {string} cropperId - ID của cropper instance
     */
    const dispose = function (cropperId) {
        try {
            const cropper = croppers[cropperId];

            if (!cropper) {
                log.info(`Cropper instance '${cropperId}' không tồn tại (đã được dọn dẹp)`, COMPONENT_NAME);
                return;
            }

            log.info(`Đang dispose cropper instance: ${cropperId}`, COMPONENT_NAME);

            cropper.destroy();
            delete croppers[cropperId];

            log.success(`Dispose cropper instance '${cropperId}' thành công`, COMPONENT_NAME);

        } catch (error) {
            log.error(`Lỗi khi dispose cropper instance '${cropperId}'`, COMPONENT_NAME, error);
        }
    };

    // Public API
    return {
        preload,
        init,
        getCroppedCanvas,
        rotate,
        scaleX,
        scaleY,
        zoom,
        reset,
        clear,
        disable,
        enable,
        setAspectRatio,
        setDragMode,
        getCropBoxData,
        setCropBoxData,
        dispose
    };
})();