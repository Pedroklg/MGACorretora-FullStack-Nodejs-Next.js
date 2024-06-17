import { useEffect, useState } from 'react';

const ProgressBar = ({ loading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setInterval(() => {
                if (progress < 100) {
                    setProgress(prevProgress => prevProgress + 10);
                } else {
                    clearInterval(timer);
                }
            }, 500);
        } else {
            setProgress(0);
        }

        return () => {
            clearInterval(timer);
        };
    }, [loading, progress]);

    if (!loading) return null;

    return (
        <div className="bg-gray-200 h-1 fixed top-0 left-0 right-0 z-50">
            <div
                className="bg-blue-600 h-1"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
