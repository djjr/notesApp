window.addEventListener('DOMContentLoaded', (event) => {
    const iframe = document.querySelector('iframe[name="contentframe"]');
    iframe.onload = function() {
        adjustIframeHeight();
    };
    window.onresize = adjustIframeHeight;

    function adjustIframeHeight() {
        setTimeout(() => {
            const headerHeight = document.querySelector('header').offsetHeight;
            const footerHeight = document.querySelector('footer').offsetHeight;
            const availableHeight = window.innerHeight - headerHeight - footerHeight;
            const contentHeight = iframe.contentWindow.document.body.scrollHeight;

            iframe.style.height = Math.max(availableHeight, contentHeight) + 'px';
        }, 0);
    }
});