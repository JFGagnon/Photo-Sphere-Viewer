import { AbstractAdapter } from '../adapters/AbstractAdapter';
import type { Navbar } from '../components/Navbar';
import icon from '../icons/download.svg';
import { ConfigChangedEvent } from '../events';
import { AbstractButton } from './AbstractButton';

export class DownloadButton extends AbstractButton {
    static override readonly id = 'download';

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-download-butto',
            hoverScale: true,
            collapsable: true,
            tabbable: true,
            icon: icon,
        });

        this.viewer.addEventListener(ConfigChangedEvent.type, this);
    }

    override destroy(): void {
        this.viewer.removeEventListener(ConfigChangedEvent.type, this);

        super.destroy();
    }

    handleEvent(e: Event) {
        if (e instanceof ConfigChangedEvent) {
            e.containsOptions('downloadUrl') && this.checkSupported();
        }
    }

    onClick() {
        const link = document.createElement('a');
        link.href = this.viewer.config.downloadUrl || this.viewer.config.panorama;
        link.download = link.href.split('/').pop();
        this.viewer.container.appendChild(link);
        link.click();

        setTimeout(() => {
            this.viewer.container.removeChild(link);
        }, 100);
    }

    override checkSupported() {
        const supported =
            (this.viewer.adapter.constructor as typeof AbstractAdapter).supportsDownload ||
            this.viewer.config.downloadUrl;
        if (supported) {
            this.show();
        } else {
            this.hide();
        }
    }
}
