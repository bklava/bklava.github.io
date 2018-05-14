'use strict';

import QrCodeDetector = require('jsqr');
import Messages from './Messages'


declare class OverconstrainedError {

}

export default class QRCodeReader {

    private widget: HTMLDivElement;
    private video: HTMLVideoElement;
    private ctx: CanvasRenderingContext2D;
    private detectorOutput: HTMLDivElement;
    private lastDetectedCode: HTMLDivElement;

    public constructor() {

        this.widget = document.createElement('div');
        this.widget.setAttribute('class', 'qr-code-reader');
        document.body.appendChild(this.widget);

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.debug('Navigator has mediaDevices.getUserMedia API')
            console.debug('Supported constraints', navigator.mediaDevices.getSupportedConstraints());

            var mobileConstraints = {
                audio: false,
                video: {
                    facingMode: {
                        exact: 'environment'
                    }
                }
            }

            this.tryCapture(mobileConstraints, (e) => this.onMobileInitError(e));

        } else {
            this.error('Navigator without mediaDevices.getUserMedia API');
        }

    }

    private onMobileInitError(e) {
        console.debug('Not mobile environment');
        if (e instanceof OverconstrainedError) {
            var desktopConstraints = {
                audio: false,
                video: true
            }
            this.tryCapture(desktopConstraints, (e) => this.error(e));
        } else {
            this.error(e);
        }
    }

    private tryCapture(constraints, errorHandler) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => this.streamLoaded(stream))
            .catch(errorHandler);
    }

    private streamLoaded(stream) {
        try {

            this.video = document.createElement('video');
            this.video.setAttribute('autoplay', '');
            this.video.setAttribute('playsinline', '');
            // document.body.appendChild(this.video);

            console.debug(stream);
            this.video.srcObject = stream;
            this.video.play();

            this.video.addEventListener('canplaythrough', () => this.startDetection(), false);

        } catch (e) {
            console.error(e);
        }
    }

    private startDetection() {

        var canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        this.widget.appendChild(canvas);

        this.ctx = canvas.getContext('2d');

        const outputContainer = document.createElement('div');
        outputContainer.setAttribute('class', 'output');
        this.widget.appendChild(outputContainer);

        this.detectorOutput = document.createElement('div');
        this.detectorOutput.setAttribute('class', 'detector');
        outputContainer.appendChild(this.detectorOutput);
        this.lastDetectedCode = document.createElement('div');
        this.lastDetectedCode.setAttribute('class', 'last-detected');
        outputContainer.appendChild(this.lastDetectedCode);

        this.lastDetectedCode.innerHTML = Messages.lastCodeDetectedLabel;

        requestAnimationFrame(() => this.detectionLoop());

    }

    private detectionLoop() {

        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {

            const width = this.video.videoWidth;
            const height = this.video.videoHeight;
            this.ctx.drawImage(this.video, 0, 0, width, height);
            const imageData = this.ctx.getImageData(0, 0, width, height).data;
            try {
                var code = QrCodeDetector.default(imageData, width, height);
                if (code) {
                    this.drawLine(code.location.topLeftCorner, code.location.topRightCorner);
                    this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner);
                    this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner);
                    this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner);
                    this.detectionOutput(code.data);
                } else {
                    this.detectionOutput(null);
                }
            } catch (e) {
                console.error('Ignoring error', e);
            }

        }

        requestAnimationFrame(() => this.detectionLoop());
    }

    private drawLine(begin, end) {
        this.ctx.beginPath();
        this.ctx.moveTo(begin.x, begin.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#0F0';
        this.ctx.stroke();
    }

    private detectionOutput(output) {
        if (output == null || output.length == 0) {
            this.detectorOutput.innerText = Messages.notDetected;
        } else {
            this.detectorOutput.innerText = output;
            this.lastDetectedCode.innerHTML = Messages.lastCodeDetectedLabel + this.formatCode(output);
        }
    }

    private formatCode(code: string) {
        if (code.length == 18) {
            return `<span class="code">${code.substr(0, 9)}</span><span class="code-highlighted">${code.substr(9, 4)}</span><span class="code">${code.substr(13)}</span>`
        } else {
            return `<span class="code">${code}</span>`
        }
    }

    private error(e) {
        const errorMessage = document.createElement('div')
        errorMessage.setAttribute('class', 'error');
        errorMessage.textContent = e;
        this.widget.appendChild(errorMessage);
    }

}