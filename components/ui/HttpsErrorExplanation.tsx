import React from 'react';
import { LockIcon, ExternalLinkIcon } from './icons';

export const HttpsErrorExplanation: React.FC = () => {
    return (
        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-800 dark:text-red-300 rounded-r-lg">
            <h4 className="font-bold text-sm flex items-center gap-2">
                <LockIcon className="h-5 w-5" />
                Secure Connection (HTTPS) Required
            </h4>
            <div className="mt-2 text-xs space-y-3">
                <p>
                    To protect your data, Facebook requires that all applications using its login features are served over a secure HTTPS connection. This application is currently running on an insecure HTTP connection.
                </p>
                <p>
                    <strong>Why is this necessary?</strong> HTTPS encrypts the data between your browser and the server, preventing unauthorized access to your credentials and access tokens. It also verifies that you are connecting to the authentic server, protecting against impersonation attacks.
                </p>
                <p>
                    <strong>What to do:</strong> If you are running this application locally, you need to enable HTTPS for the development server.
                </p>
                <a 
                    href="https://github.com/GP0ll0B/G-I-X-Generate/blob/main/README.md#local-development-with-https"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-red-700 dark:text-red-200 hover:underline"
                >
                    See setup instructions in the README <ExternalLinkIcon className="h-3 w-3" />
                </a>
            </div>
        </div>
    );
};
