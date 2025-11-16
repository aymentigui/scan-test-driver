'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
    onScan: (decodedText: string) => void;
    onError: (error: Error) => void;
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isScanning = useRef(false);

    useEffect(() => {
        const startScanner = async () => {
            if (isScanning.current) return;

            try {
                const scanner = new Html5Qrcode('qr-reader');
                scannerRef.current = scanner;
                isScanning.current = true;

                await scanner.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText: any) => {
                        scanner.stop();
                        isScanning.current = false;
                        onScan(decodedText);
                    },
                    (errorMessage) => {
                        // Ignorer les erreurs de scan normales
                    }
                );
            } catch (err) {
                isScanning.current = false;
                onError(err as Error);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && isScanning.current) {
                scannerRef.current.stop().catch(console.error);
                isScanning.current = false;
            }
        };
    }, [onScan, onError]);

    return (
        <div className="overflow-hidden rounded-xl">
            <div id="qr-reader" className="w-full"></div>
        </div>
    );
}