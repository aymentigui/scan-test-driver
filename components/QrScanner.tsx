'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
    onScan: (decodedText: string) => void;
    onError: (error: Error) => void;
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isActive = useRef(false);

    useEffect(() => {
        const startScanner = async () => {
            try {
                const scanner = new Html5Qrcode('qr-reader');
                scannerRef.current = scanner;
                isActive.current = true;

                await scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    async (decodedText) => {
                        if (!isActive.current) return;

                        isActive.current = false;
                        await scanner.stop().catch(() => { });
                        onScan(decodedText);
                    },
                    () => { }
                );
            } catch (err) {
                onError(err as Error);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && isActive.current) {
                scannerRef.current.stop().catch(() => { });
                isActive.current = false;
            }
        };
    }, []);

    return (
        <div className="overflow-hidden rounded-xl">
            <div id="qr-reader" className="w-full" />
        </div>
    );
}
